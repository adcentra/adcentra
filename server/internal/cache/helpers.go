package cache

import (
	"context"
	"encoding/json"
	"time"
)

// TryGet attempts to get and unmarshal data from cache.
// Returns true if successful, false if cache miss or error (graceful degradation).
func TryGet(ctx context.Context, c Cache, key string, dest any) bool {
	if c == nil {
		return false // No cache available
	}

	data, err := c.Get(ctx, key)
	if err != nil || data == nil {
		return false // Cache miss or error
	}

	if err := json.Unmarshal(data, dest); err != nil {
		return false // Unmarshal error
	}

	return true
}

// TrySet attempts to marshal and set data to cache.
// Silently fails on error to ensure cache doesn't break main functionality.
func TrySet(ctx context.Context, c Cache, key string, value any, ttl time.Duration) {
	if c == nil {
		return // No cache available
	}

	data, err := json.Marshal(value)
	if err != nil {
		return // Marshal error - silently ignore
	}

	// Set to cache - ignore errors to ensure graceful degradation
	c.Set(ctx, key, data, ttl)
}

// TryInvalidate attempts to delete cache keys.
// Silently fails on error to ensure cache doesn't break main functionality.
func TryInvalidate(ctx context.Context, c Cache, keys ...string) {
	if c == nil {
		return // No cache available
	}

	for _, key := range keys {
		c.Delete(ctx, key) // Ignore errors
	}
}

// TryInvalidatePattern attempts to invalidate cache by pattern.
// Silently fails on error to ensure cache doesn't break main functionality.
func TryInvalidatePattern(ctx context.Context, c Cache, pattern string) {
	if c == nil {
		return // No cache available
	}

	c.Invalidate(ctx, pattern) // Ignore errors
}
