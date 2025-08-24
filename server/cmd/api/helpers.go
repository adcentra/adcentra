package main

import (
	"fmt"
	"log/slog"
	"math/rand"
	"runtime/debug"
)

type envelope map[string]any

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

func (app *application) generateRandomString(length int, chars string) (string, error) {
	b := make([]byte, length)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b), nil
}
