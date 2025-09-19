package main

import (
	"context"
	"errors"
	"net/http"
	"time"

	"adcentra.ai/internal/data"
	"adcentra.ai/internal/validator"
	"github.com/labstack/echo/v4"
)

func (app *application) registerUser(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(err)
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

	if data.ValidateUser(v, user); !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	err := app.models.Users.Insert(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrDuplicateEmail):
			v.AddError("email", "A user with this email already exists")
			return app.failedValidationResponse(v.Errors)
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

	return e.JSON(http.StatusAccepted, echo.Map{
		"user": user,
	})
}

func (app *application) activateUser(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		TokenPlainText string `json:"token"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(err)
	}

	v := validator.New()

	if data.ValidateTokenPlaintext(v, input.TokenPlainText); !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	user, err := app.models.Users.GetForToken(ctx, data.ScopeActivation, input.TokenPlainText)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("token", "Invalid or expired activation token")
			return app.failedValidationResponse(v.Errors)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	user.Activated = true

	err = app.models.Users.Update(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			return app.editConflictResponse()
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
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		TokenPlainText string `json:"token"`
		Password       string `json:"password"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(err)
	}

	v := validator.New()

	data.ValidateTokenPlaintext(v, input.TokenPlainText)
	data.ValidatePasswordPlaintext(v, input.Password)

	if !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	user, err := app.models.Users.GetForToken(ctx, data.ScopePasswordReset, input.TokenPlainText)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("token", "Invalid or expired password reset token")
			return app.failedValidationResponse(v.Errors)
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
			return app.editConflictResponse()
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
