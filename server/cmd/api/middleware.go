package main

import (
	"context"
	"errors"
	"expvar"
	"strconv"
	"strings"
	"time"

	"adcentra.ai/internal/data"
	"adcentra.ai/internal/validator"
	"github.com/labstack/echo/v4"
)

func (app *application) metrics() echo.MiddlewareFunc {
	// Initialize once when the middleware is added to the router
	var (
		totalRequestsReceived           = expvar.NewInt("total_requests_received")
		totalResponseSent               = expvar.NewInt("total_response_sent")
		totalInFlightRequests           = expvar.NewInt("total_in_flight_requests")
		totalProcessingTimeMicroseconds = expvar.NewInt("total_processing_time_μs")
		totalResponsesSentByStatus      = expvar.NewMap("total_responses_sent_by_status")
	)

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			start := time.Now()

			totalRequestsReceived.Add(1)

			// Execute the next handler in the chain
			err := next(c)

			totalResponseSent.Add(1)
			totalInFlightRequests.Set(totalRequestsReceived.Value() - totalResponseSent.Value())

			// Get status code from Echo's response
			statusCode := c.Response().Status
			totalResponsesSentByStatus.Add(strconv.Itoa(statusCode), 1)

			duration := time.Since(start).Microseconds()
			totalProcessingTimeMicroseconds.Add(duration)

			return err
		}
	}
}

func (app *application) authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		ctx, cancel := context.WithTimeout(c.Request().Context(), 5*time.Second)
		defer cancel()

		c.Response().Header().Set("Vary", "Authorization")

		authorizationHeader := c.Request().Header.Get("Authorization")

		if authorizationHeader == "" {
			app.contextSetSession(c, &data.Session{
				User: data.AnonymousUser,
			})
			return next(c)
		}

		headerParts := strings.Split(authorizationHeader, " ")
		if len(headerParts) != 2 || headerParts[0] != "Bearer" {
			return app.invalidAuthenticationTokenResponse(c)
		}

		tokenPlainText := headerParts[1]

		v := validator.New()

		if data.ValidateTokenPlaintext(v, tokenPlainText); !v.Valid() {
			return app.invalidAuthenticationTokenResponse(c)
		}

		session, err := app.models.Sessions.GetForToken(ctx, tokenPlainText)
		if err != nil {
			switch {
			case errors.Is(err, data.ErrRecordNotFound):
				return app.invalidAuthenticationTokenResponse(c)
			default:
				return app.serverErrorResponse(c, err)
			}
		}

		permissions := app.models.Permissions.GetAllForUserCached(ctx, session.User.ID)
		if permissions == nil {
			permissions, err = app.models.Permissions.GetAllForUser(ctx, session.User.ID)
			if err != nil {
				return app.serverErrorResponse(c, err)
			}
			app.models.Permissions.SetAllForUserToCache(ctx, session.User.ID, permissions)
		}
		permissionMap := make(map[data.PermCode]bool)
		for _, permission := range permissions {
			permissionMap[permission] = true
		}
		session.PermissionMap = permissionMap

		roles := app.models.Roles.GetAllForUserCached(ctx, session.User.ID)
		if roles == nil {
			roles, err = app.models.Roles.GetAllForUser(ctx, session.User.ID)
			if err != nil {
				return app.serverErrorResponse(c, err)
			}
			app.models.Roles.SetAllForUserToCache(ctx, session.User.ID, roles)
		}
		if err != nil {
			return app.serverErrorResponse(c, err)
		}
		session.Roles = roles

		app.contextSetSession(c, session)
		return next(c)
	}
}

func (app *application) requireAuthentication(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		session := app.contextGetSession(c)
		if session.User.IsAnonymous() {
			return app.authenticationRequiredResponse()
		}

		return next(c)
	}
}

func (app *application) requireActivation(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		session := app.contextGetSession(c)

		if !session.User.Activated {
			return app.inactiveAccountResponse()
		}

		return next(c)
	}
}

func (app *application) requirePermissions(permCodes ...data.PermCode) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			session := app.contextGetSession(c)

			if session.Roles.Has(data.RoleSuperAdmin) {
				return next(c)
			}

			for _, code := range permCodes {
				if !session.PermissionMap[code] {
					return app.notPermittedResponse()
				}
			}

			return next(c)
		}
	}
}
