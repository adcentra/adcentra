package cache

import (
	"context"
	"time"
)

type Cache interface {
	Get(ctx context.Context, key string) ([]byte, error)
	Set(ctx context.Context, key string, value []byte, ttl time.Duration) error
	Delete(ctx context.Context, key string) error
	Invalidate(ctx context.Context, pattern string) error
}

// NullCache provides a no-op cache implementation for graceful degradation
type NullCache struct{}

func NewNullCache() *NullCache {
	return &NullCache{}
}

func (c *NullCache) Get(ctx context.Context, key string) ([]byte, error) {
	return nil, nil // Always cache miss
}

func (c *NullCache) Set(ctx context.Context, key string, value []byte, ttl time.Duration) error {
	return nil // No-op
}

func (c *NullCache) Delete(ctx context.Context, key string) error {
	return nil // No-op
}

func (c *NullCache) Invalidate(ctx context.Context, pattern string) error {
	return nil // No-op
}
