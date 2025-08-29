package main

import (
	"context"

	"adcentra.ai/internal/data"
	"github.com/labstack/echo/v4"
)

type contextKey string

const sessionContextKey = contextKey("sesssion")

func (app *application) contextSetSession(c echo.Context, session *data.Session) {
	ctx := context.WithValue(c.Request().Context(), sessionContextKey, session)
	c.SetRequest(c.Request().WithContext(ctx))
}

func (app *application) contextGetSession(c echo.Context) *data.Session {
	session, ok := c.Request().Context().Value(sessionContextKey).(*data.Session)
	if !ok {
		// The only time that we'll use this helper is when we logically expect there to be User struct
		// value in the context, and if it doesn't exist it will firmly be an 'unexpected' error.
		// It's OK to panic in this case
		panic("missing session value in request context")
	}

	return session
}
