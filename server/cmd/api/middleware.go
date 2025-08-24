package main

import (
	"expvar"
	"strconv"
	"time"

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
