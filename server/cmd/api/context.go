package main

import (
	"context"

	"adcentra.ai/internal/data"
	"github.com/labstack/echo/v4"
	"github.com/nicksnyder/go-i18n/v2/i18n"
)

type contextKey string

const (
	sessionContextKey   = contextKey("sesssion")
	localizerContextKey = contextKey("localizer")
)

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

func (app *application) contextSetLocalizer(c echo.Context, localizer *i18n.Localizer) {
	ctx := context.WithValue(c.Request().Context(), localizerContextKey, localizer)
	c.SetRequest(c.Request().WithContext(ctx))
}

func (app *application) contextGetLocalizer(c echo.Context) *i18n.Localizer {
	localizer, ok := c.Request().Context().Value(localizerContextKey).(*i18n.Localizer)
	if !ok {
		panic("missing localizer value in request context")
	}

	return localizer
}
