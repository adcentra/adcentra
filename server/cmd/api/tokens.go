package main

import (
	"context"
	"crypto/sha256"
	"errors"
	"net/http"
	"time"

	"adcentra.ai/internal/data"
	"adcentra.ai/internal/validator"
	"github.com/labstack/echo/v4"
)

const (
	deleteGlobalSessionScope = "global"
	deleteLocalSessionScope  = "local"
	deleteOthersSessionScope = "others"

	authTokenTTL          = 1 * time.Hour
	refreshTokenTTL       = 15 * 24 * time.Hour
	activationTokenTTL    = 12 * time.Hour
	passwordResetTokenTTL = 45 * time.Minute
)

func (app *application) createAuthenticationToken(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	var input struct {
		UsernameOrEmail string `json:"username_or_email"`
		Password        string `json:"password"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(err)
	}

	var isInputEmail bool
	v := validator.New()

	if validator.Matches(input.UsernameOrEmail, validator.EmailRX) {
		data.ValidateEmail(v, input.UsernameOrEmail)
		isInputEmail = true
	} else if validator.Matches(input.UsernameOrEmail, validator.UsernameBasicRX) {
		data.ValidateUsername(v, input.UsernameOrEmail)
		isInputEmail = false
	} else {
		if !validator.NotBlank(input.UsernameOrEmail) {
			v.AddError("username_or_email", "Username or email must be provided")
		} else {
			v.AddError("username_or_email", "Invalid username or email")
		}
	}
	v.Check(validator.NotBlank(input.Password), "password", "Password must be provided")

	if !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	var user *data.User
	var err error
	var authSuccess bool
	if isInputEmail {
		user, err = app.models.Users.GetByEmail(ctx, input.UsernameOrEmail)
	} else {
		user, err = app.models.Users.GetByUsername(ctx, input.UsernameOrEmail)
	}
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			// If the user does not exist, run a dummy match to prevent timing attacks on username/email.
			user = &data.User{}
			user.Password.DummyMatches(input.Password)
			authSuccess = false
		default:
			return app.serverErrorResponse(e, err)
		}
	} else {
		authSuccess, err = user.Password.Matches(input.Password)
		if err != nil {
			return app.serverErrorResponse(e, err)
		}
	}

	if !authSuccess {
		return app.invalidCredentialsResponse()
	}

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
			return app.editConflictResponse()
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

func (app *application) deleteAuthenticationToken(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	session := app.contextGetSession(e)

	deleteSessionScope := e.QueryParam("scope")
	// Get the refresh token from the cookie so that the refresh token of the session
	// can be deleted if the logout scope is local (or avoid deleting if logout scope is others)
	refreshTokenCookie, err := e.Cookie("refresh_token")
	if err != nil {
		return app.invalidCredentialsResponse()
	}
	refreshToken := refreshTokenCookie.Value

	switch deleteSessionScope {
	case deleteLocalSessionScope:
		if refreshToken != "" && len(refreshToken) == 26 {
			refreshTokenHash := sha256.Sum256([]byte(refreshToken))
			err = app.models.Tokens.DeleteByHash(ctx, refreshTokenHash[:])
		}
		if err == nil {
			err = app.models.Tokens.DeleteByHash(ctx, session.Token.Hash)
		}
	case deleteGlobalSessionScope:
		// Delete all refresh tokens for the user
		err = app.models.Tokens.DeleteAllForUser(ctx, data.ScopeRefresh, session.User.ID)
		if err == nil {
			// Delete all authentication tokens for the user
			err = app.models.Tokens.DeleteAllForUser(ctx, data.ScopeAuthentication, session.User.ID)
		}
	case deleteOthersSessionScope:
		// Delete all refresh tokens for the user except the current one
		if refreshToken != "" && len(refreshToken) == 26 {
			refreshTokenHash := sha256.Sum256([]byte(refreshToken))
			err = app.models.Tokens.DeleteAllForUserExcept(ctx, data.ScopeRefresh, session.User.ID, refreshTokenHash[:])
		}
		if err == nil {
			// Delete all authentication tokens for the user except the current one
			err = app.models.Tokens.DeleteAllForUserExcept(ctx, data.ScopeAuthentication, session.User.ID, session.Token.Hash)
		}
	default:
		v := validator.New()
		v.AddError("scope", "invalid scope")
		return app.failedValidationResponse(v.Errors)
	}
	if err != nil {
		return app.serverErrorResponse(e, err)
	}
	// Invalidate Permissions and Roles cache when user logs out.
	// For simplicity, invalidate all cached permissions and roles for the user regardless of the scope
	app.models.Permissions.InvalidateAllForUserCache(ctx, session.User.ID)
	app.models.Roles.InvalidateAllForUserCache(ctx, session.User.ID)

	return e.NoContent(http.StatusOK)
}

func (app *application) createActivationToken(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 6*time.Second)
	defer cancel()

	var input struct {
		Email string `json:"email"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(err)
	}

	v := validator.New()

	if data.ValidateEmail(v, input.Email); !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	user, err := app.models.Users.GetByEmail(ctx, input.Email)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("email", "No matching email address found")
			return app.failedValidationResponse(v.Errors)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	if user.Activated {
		v.AddError("email", "Your account has already been activated")
		return app.failedValidationResponse(v.Errors)
	}

	token, err := app.models.Tokens.New(ctx, user.ID, activationTokenTTL, data.ScopeActivation)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	app.background(func() {
		data := map[string]any{
			"activationToken": token.Plaintext,
			"username":        user.Username,
		}

		err = app.mailer.Send(user.Email, "activation_token.tmpl", data)
		if err != nil {
			app.logger.Error(err.Error())
		}
	})

	return e.JSON(http.StatusAccepted, echo.Map{
		"message": "An email will be sent to you containing the activation token",
	})
}

func (app *application) createPasswordResetToken(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 6*time.Second)
	defer cancel()

	var input struct {
		Email string `json:"email"`
	}

	if err := e.Bind(&input); err != nil {
		return app.badRequestResponse(err)
	}

	v := validator.New()

	if data.ValidateEmail(v, input.Email); !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	user, err := app.models.Users.GetByEmail(ctx, input.Email)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			v.AddError("email", "No matching account found")
			return app.failedValidationResponse(v.Errors)
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	if !user.Activated {
		v.AddError("email", "Your account must be activated to reset password")
		return app.failedValidationResponse(v.Errors)
	}

	token, err := app.models.Tokens.New(ctx, user.ID, passwordResetTokenTTL, data.ScopePasswordReset)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	app.background(func() {
		data := map[string]any{
			"passwordResetToken": token.Plaintext,
		}

		err = app.mailer.Send(user.Email, "password_reset_token.tmpl", data)
		if err != nil {
			app.logger.Error(err.Error())
		}
	})

	return e.JSON(http.StatusAccepted, echo.Map{
		"message": "An email will be sent to you containing the password reset token",
	})
}

func (app *application) refreshAuthenticationToken(e echo.Context) error {
	ctx, cancel := context.WithTimeout(e.Request().Context(), 10*time.Second)
	defer cancel()

	// Get refresh token from cookie
	refreshTokenCookie, err := e.Cookie("refresh_token")
	if err != nil {
		return app.invalidCredentialsResponse()
	}

	refreshToken := refreshTokenCookie.Value

	v := validator.New()
	if data.ValidateTokenPlaintext(v, refreshToken); !v.Valid() {
		return app.failedValidationResponse(v.Errors)
	}

	// Get the user associated with the refresh token
	user, err := app.models.Users.GetForToken(ctx, data.ScopeRefresh, refreshToken)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			return app.invalidCredentialsResponse()
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	// Implement refresh token rotation by deleting the current refresh token
	// and assigning a new one.
	refreshTokenHash := sha256.Sum256([]byte(refreshToken))
	err = app.models.Tokens.DeleteByHash(ctx, refreshTokenHash[:])
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	newRefreshToken, err := app.models.Tokens.New(ctx, user.ID, refreshTokenTTL, data.ScopeRefresh)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	// Create a new authentication token
	authToken, err := app.models.Tokens.New(ctx, user.ID, authTokenTTL, data.ScopeAuthentication)
	if err != nil {
		return app.serverErrorResponse(e, err)
	}

	// Update the last login time
	user.LastLoginAt.Time = time.Now()
	user.LastLoginAt.Valid = true
	err = app.models.Users.Update(ctx, user)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrEditConflict):
			return app.editConflictResponse()
		default:
			return app.serverErrorResponse(e, err)
		}
	}

	e.SetCookie(&http.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken.Plaintext,
		Expires:  newRefreshToken.Expiry.Time,
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

func (app *application) CleanupTokens() {
	for {
		select {
		case <-app.serverCtx.Done():
			return
		default:
			startTime := time.Now()
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()

			err := app.models.Tokens.DeleteExpiredTokens(ctx)
			if err != nil {
				app.logInternalError("app.models.Tokens.CleanupTokens failed", err)
			}
			timer := time.NewTimer(time.Until(startTime.Add(app.config.cleanup.tokensCleanupPeriod)))
			select {
			case <-app.serverCtx.Done():
				timer.Stop()
				return
			case <-timer.C:
				// Continue with the next iteration
			}
		}
	}
}
