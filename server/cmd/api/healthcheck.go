package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (app *application) healthcheck(c echo.Context) error {
	data := map[string]string{
		"status":      "available",
		"environment": app.config.env,
		"version":     version,
	}

	return c.JSON(http.StatusOK, envelope{"data": data})
}
