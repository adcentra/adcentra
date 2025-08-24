package main

import (
	"log/slog"
	"runtime/debug"
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
