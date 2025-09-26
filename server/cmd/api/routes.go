package main

import (
	"expvar"
	"time"

	"adcentra.ai/internal/data"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/time/rate"
)

func (app *application) routes() *echo.Echo {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(app.metrics())
	e.Use(middleware.SecureWithConfig(middleware.SecureConfig{
		XSSProtection:         "1; mode=block", // Prevents XSS
		ContentTypeNosniff:    "nosniff",       // Stops MIME sniffing
		XFrameOptions:         "DENY",          // No framing allowed — clickjacking protection
		HSTSMaxAge:            3600,            // Force HTTPS for 1 hour
		HSTSExcludeSubdomains: false,
		ContentSecurityPolicy: "default-src 'self';", // Restrict allowed content sources
		ReferrerPolicy:        "no-referrer",         // Hide referrer data
	}))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     app.config.cors.trustedOrigins,
		AllowMethods:     []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
		AllowCredentials: true,
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
	e.Use(app.authenticate)

	e.GET("/debug/vars", echo.WrapHandler(expvar.Handler()), app.requirePermissions(data.PermDebugVarsView))

	g := e.Group("/v1")
	g.GET("/healthcheck", app.healthcheck)
	g.POST("/users", app.registerUser)
	g.PUT("/users/activate", app.activateUser)
	g.PUT("/users/password", app.updateUserPassword)

	g.POST("/tokens/authentication", app.createAuthenticationToken)
	g.POST("/tokens/refresh", app.refreshAuthenticationToken).Name = "refresh-token"
	g.POST("/tokens/activation", app.createActivationToken)
	g.POST("/tokens/password-reset", app.createPasswordResetToken)

	a := g.Group("", app.requireAuthentication)
	a.GET("/me", app.getCurrentUser)
	a.DELETE("/tokens/authentication", app.deleteAuthenticationToken)

	return e
}
