package main

import (
	"log/slog"
	"net/http"
	"runtime/debug"

	"adcentra.ai/internal/i18n"
	"github.com/labstack/echo/v4"
)

func (app *application) logInternalError(method string, err error) {
	var (
		trace = string(debug.Stack())
	)

	app.logger.Error(
		method,
		slog.String("error", err.Error()),
		slog.String("trace", trace),
	)
}

func (app *application) logError(r *http.Request, err error) {
	var (
		method = r.Method
		uri    = r.URL.RequestURI()
		trace  = string(debug.Stack())
	)

	app.logger.Error(
		err.Error(),
		slog.String("method", method),
		slog.String("uri", uri),
		slog.String("trace", trace),
	)
}

func (app *application) wrapValidationErrors(c echo.Context, errors map[string]string) echo.Map {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "ValidationError", nil)
	
	return echo.Map{
		"message":      message,
		"field_errors": errors,
	}
}

func (app *application) serverErrorResponse(c echo.Context, err error) error {
	app.logError(c.Request(), err)
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "ServerError", nil)
	return echo.NewHTTPError(http.StatusInternalServerError, message)
}

func (app *application) badRequestResponse(c echo.Context, err error) error {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "BadRequest", nil)
	return echo.NewHTTPError(http.StatusBadRequest, message + ": " + err.Error())
}

func (app *application) failedValidationResponse(c echo.Context, errors map[string]string) error {
	return echo.NewHTTPError(http.StatusUnprocessableEntity, app.wrapValidationErrors(c, errors))
}

func (app *application) editConflictResponse(c echo.Context) error {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "EditConflict", nil)
	return echo.NewHTTPError(http.StatusConflict, message)
}

func (app *application) invalidCredentialsResponse(c echo.Context) error {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "InvalidCredentials", nil)
	return echo.NewHTTPError(http.StatusUnauthorized, message)
}

func (app *application) invalidAuthenticationTokenResponse(c echo.Context) error {
	c.Response().Header().Set("WWW-Authenticate", "Bearer")

	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "InvalidAuthToken", nil)
	return echo.NewHTTPError(http.StatusUnauthorized, message)
}

func (app *application) authenticationRequiredResponse(c echo.Context) error {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "AuthenticationRequired", nil)
	return echo.NewHTTPError(http.StatusUnauthorized, message)
}

func (app *application) inactiveAccountResponse(c echo.Context) error {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "InactiveAccount", nil)
	return echo.NewHTTPError(http.StatusForbidden, message)
}

func (app *application) notPermittedResponse(c echo.Context) error {
	localizer := app.contextGetLocalizer(c)
	message := i18n.LocalizeMessage(localizer, "NotPermitted", nil)
	return echo.NewHTTPError(http.StatusForbidden, message)
}
