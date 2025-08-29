package data

import (
	"errors"

	"adcentra.ai/internal/cache"
	"adcentra.ai/internal/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRecordNotFound   = errors.New("record not found")
	ErrEditConflict     = errors.New("edit conflict")
	ErrUniqueConstraint = errors.New("unique constraint violation")
)

type Models struct {
	Users       UserModel
	Tokens      TokenModel
	Sessions    SessionModel
	Permissions PermissionModel
	Roles       RoleModel
}

func NewModels(pool *pgxpool.Pool, cacheInstance cache.Cache) Models {
	queries := sqlc.New(pool)
	return Models{
		Users:       UserModel{pool: pool, queries: queries},
		Tokens:      TokenModel{pool: pool, queries: queries},
		Sessions:    SessionModel{pool: pool, queries: queries},
		Permissions: PermissionModel{pool: pool, queries: queries, cache: cacheInstance},
		Roles:       RoleModel{pool: pool, queries: queries, cache: cacheInstance},
	}
}
