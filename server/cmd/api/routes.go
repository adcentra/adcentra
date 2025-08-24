package main

import (
	"expvar"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

func (app *application) routes() *echo.Echo {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(app.metrics())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: app.config.cors.trustedOrigins,
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType},
	}))
	if app.config.limiter.enabled {
		e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStoreWithConfig(
			middleware.RateLimiterMemoryStoreConfig{
				Rate:      rate.Limit(app.config.limiter.rps),
				Burst:     app.config.limiter.burst,
				ExpiresIn: 3 * time.Minute,
			},
		)))
	}

	e.GET("/healthcheck", app.healthcheck)

	e.GET("/debug/vars", echo.WrapHandler(expvar.Handler()))

	return e
}
