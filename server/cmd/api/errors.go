package main

import (
	"log/slog"
	"net/http"
	"runtime/debug"

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

func (app *application) wrapValidationErrors(errors map[string]string) echo.Map {
	return echo.Map{
		"message":      "The data you provided is invalid, please fix the errors and try again.",
		"field_errors": errors,
	}
}

func (app *application) serverErrorResponse(e echo.Context, err error) error {
	app.logError(e.Request(), err)
	return echo.NewHTTPError(http.StatusInternalServerError, "The server encountered a problem and could not process your request")
}

func (app *application) badRequestResponse(err error) error {
	return echo.NewHTTPError(http.StatusBadRequest, err.Error())
}

func (app *application) failedValidationResponse(errors map[string]string) error {
	return echo.NewHTTPError(http.StatusUnprocessableEntity, app.wrapValidationErrors(errors))
}

func (app *application) editConflictResponse() error {
	return echo.NewHTTPError(http.StatusConflict, "Unable to update the record due to an edit conflict, please try again")
}

func (app *application) invalidCredentialsResponse() error {
	return echo.NewHTTPError(http.StatusUnauthorized, "Invalid authentication credentials")
}

func (app *application) invalidAuthenticationTokenResponse(c echo.Context) error {
	c.Response().Header().Set("WWW-Authenticate", "Bearer")

	message := "Invalid or missing authentication token"
	return echo.NewHTTPError(http.StatusUnauthorized, message)
}

func (app *application) authenticationRequiredResponse() error {
	message := "You must be authenticated to access this resource"
	return echo.NewHTTPError(http.StatusUnauthorized, message)
}

func (app *application) inactiveAccountResponse() error {
	message := "Your account must be activated to access this resource"
	return echo.NewHTTPError(http.StatusForbidden, message)
}

func (app *application) notPermittedResponse() error {
	message := "Your account doesn't have the necessary permissions to access this resource"
	return echo.NewHTTPError(http.StatusForbidden, message)
}
