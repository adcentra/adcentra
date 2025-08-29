package main

import (
	"fmt"
	"log/slog"
	"runtime/debug"
)

func (app *application) background(fn func()) {
	app.wg.Go(func() {
		defer func() {
			if err := recover(); err != nil {
				app.logger.Error(
					fmt.Sprintf("%v", err),
					slog.String("trace", string(debug.Stack())),
				)
			}
		}()

		fn()
	})
}
