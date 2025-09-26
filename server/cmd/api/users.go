package main

import (
	"context"
	"errors"
	"net/http"
	"time"

	"adcentra.ai/internal/data"
	"adcentra.ai/internal/i18n"
	"adcentra.ai/internal/validator"
	"github.com/labstack/echo/v4"
)

func (app *application) registerUser(e echo.Context) error {
	localizer := app.contextGetLocalizer(e)
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(e, err)
	}

	user := &data.User{
		FullName:  input.FullName,
		Email:     input.Email,
		Activated: false,
	}

	if err := user.Password.Set(input.Password); err != nil {
		return err
	}

	v := validator.New()

	if data.ValidateUser(v, localizer, user); !v.Valid() {
		return app.failedValidationResponse(e, v.Errors)
	}

	err := app.models.Users.Insert(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateEmail):
			v.AddError("email", i18n.LocalizeMessage(localizer, "UserAlreadyExists", nil))
			return app.failedValidationResponse(e, v.Errors)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	token, err := app.models.Tokens.New(ctx, user.ID, 3*24*time.Hour, data.ScopeActivation)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	app.background(func() {
		data := map[string]any{
			"activationToken": token.Plaintext,
			"fullName":        user.FullName,
		}
		err = app.mailer.Send(user.Email, "user_welcome.tmpl", data)
		if err != nil {
			// Importantly, if there is an error sending the email then we use the
			// app.logger.Error() helper to manage it, instead of the
			// app.serverErrorResponse() helper.
			app.logger.Error(err.Error())
		}
	})

	// Log the user in
	refreshToken, err := app.models.Tokens.New(ctx, user.ID, refreshTokenTTL, data.ScopeRefresh)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	authToken, err := app.models.Tokens.New(ctx, user.ID, authTokenTTL, data.ScopeAuthentication)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	user.LastLoginAt.Time = time.Now()
	user.LastLoginAt.Valid = true
	err = app.models.Users.Update(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			return app.editConflictResponse(e)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	e.SetCookie(&http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken.Plaintext,
		Expires:  refreshToken.Expiry.Time,
		Path:     "/v1/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	return e.JSON(http.StatusCreated, echo.Map{
		"authentication_token": authToken,
		"user":                 user,
	})
}

func (app *application) activateUser(e echo.Context) error {
	localizer := app.contextGetLocalizer(e)
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		TokenPlainText string `json:"token"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(e, err)
	}

	v := validator.New()

	if data.ValidateTokenPlaintext(v, localizer, input.TokenPlainText); !v.Valid() {
		return app.failedValidationResponse(e, v.Errors)
	}

	user, err := app.models.Users.GetForToken(ctx, data.ScopeActivation, input.TokenPlainText)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("token", i18n.LocalizeMessage(localizer, "InvalidToken", nil))
			return app.failedValidationResponse(e, v.Errors)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	user.Activated = true

	err = app.models.Users.Update(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			return app.editConflictResponse(e)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	err = app.models.Tokens.DeleteAllForUser(ctx, data.ScopeActivation, user.ID)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	return e.NoContent(http.StatusOK)
}

func (app *application) getCurrentUser(e echo.Context) error {
	session := app.contextGetSession(e)

	return e.JSON(http.StatusOK, echo.Map{
		"user": session.User,
	})
}

func (app *application) updateUserPassword(e echo.Context) error {
	localizer := app.contextGetLocalizer(e)
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		TokenPlainText string `json:"token"`
		Password       string `json:"password"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(e, err)
	}

	v := validator.New()

	data.ValidateTokenPlaintext(v, localizer, input.TokenPlainText)
	data.ValidatePasswordPlaintext(v, localizer, input.Password)

	if !v.Valid() {
		return app.failedValidationResponse(e, v.Errors)
	}

	user, err := app.models.Users.GetForToken(ctx, data.ScopePasswordReset, input.TokenPlainText)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("token", i18n.LocalizeMessage(localizer, "InvalidToken", nil))
			return app.failedValidationResponse(e, v.Errors)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	err = user.Password.Set(input.Password)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	err = app.models.Users.Update(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			return app.editConflictResponse(e)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	err = app.models.Tokens.DeleteAllForUser(ctx, data.ScopePasswordReset, user.ID)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	return e.NoContent(http.StatusOK)
}
