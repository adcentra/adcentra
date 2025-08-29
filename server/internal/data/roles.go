package data

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"strconv"
	"strings"
	"time"

	"adcentra.ai/internal/cache"
	"adcentra.ai/internal/db/sqlc"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Role string

const (
	RoleSuperAdmin Role = "superadmin"
	RoleAdmin      Role = "admin"
	RoleModerator  Role = "moderator"
	RoleUser       Role = "user"
)

type Roles []Role

func (r Roles) Has(role Role) bool {
	return slices.Contains(r, role)
}

func (r Roles) ToStrings() []string {
	stringRoles := make([]string, len(r))
	for i, role := range r {
		stringRoles[i] = string(role)
	}
	return stringRoles
}

func (r *Roles) FromStrings(strings []string) {
	for _, code := range strings {
		*r = append(*r, Role(code))
	}
}

type RoleModel struct {
	pool    *pgxpool.Pool
	queries *sqlc.Queries
	cache   cache.Cache
}

const RolesCacheTTL = 5 * time.Minute

func (m RoleModel) Exists(ctx context.Context, role Role) error {
	exists, err := m.queries.RoleExists(ctx, string(role))
	if err != nil {
		return err
	}
	if !exists {
		return ErrRecordNotFound
	}

	return nil
}

func (m RoleModel) GetAllForUserCached(ctx context.Context, userID int64) Roles {
	key := cache.GenerateRolesKey(userID)
	var roles Roles
	if cache.TryGet(ctx, m.cache, key, &roles) {
		return roles
	}

	return nil
}

func (m RoleModel) SetAllForUserToCache(ctx context.Context, userID int64, roles Roles) {
	key := cache.GenerateRolesKey(userID)
	cache.TrySet(ctx, m.cache, key, roles, RolesCacheTTL)
}

func (m RoleModel) InvalidateAllForUserCache(ctx context.Context, userID int64) {
	key := cache.GenerateRolesKey(userID)
	cache.TryInvalidate(ctx, m.cache, key)
}

func (m RoleModel) GetAllForUser(ctx context.Context, userID int64) (Roles, error) {
	stringRoles, err := m.queries.GetAllRolesForUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	var roles Roles
	roles.FromStrings(stringRoles)

	return roles, nil
}

func (m RoleModel) AddForUser(ctx context.Context, userID int64, roles Roles) error {
	err := m.queries.AddRolesForUser(ctx, sqlc.AddRolesForUserParams{
		UserID:    userID,
		RoleCodes: roles.ToStrings(),
	})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			if pgErr.Code == strconv.Itoa(23505) && strings.Contains(pgErr.ConstraintName, "user_roles_pkey") {
				return ErrUniqueConstraint
			}
		}
		return err
	}
	return nil
}

func (m RoleModel) RemoveForUser(ctx context.Context, userID int64, roles Roles) error {
	result, err := m.queries.RemoveRolesForUser(ctx, sqlc.RemoveRolesForUserParams{
		UserID:    userID,
		RoleCodes: roles.ToStrings(),
	})
	if err != nil {
		return err
	}

	rowsAffected := result.RowsAffected()
	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

func (m RoleModel) ListUsersWithRole(ctx context.Context, role Role, filters Filters) ([]*User, Metadata, error) {
	query := fmt.Sprintf(`
		SELECT COUNT(*) OVER(), u.id, u.created_at, u.updated_at, u.full_name, u.username, u.email
		FROM users u
		INNER JOIN user_roles ur ON u.id = ur.user_id
		INNER JOIN roles r ON ur.role_id = r.id
		WHERE r.code = $1
		ORDER BY %s %s, u.id ASC
		LIMIT $2 OFFSET $3`,
		filters.sortColumn(sortColumnMapping{}),
		filters.sortDirection(),
	)

	rows, err := m.pool.Query(ctx, query, role, filters.limit(), filters.offset())
	if err != nil {
		return nil, getEmptyMetadata(filters.Page, filters.PageSize), err
	}

	totalRecords := 0
	users, err := pgx.CollectRows(rows, func(row pgx.CollectableRow) (*User, error) {
		var user User
		err := row.Scan(
			&totalRecords,
			&user.ID,
			&user.CreatedAt,
			&user.UpdatedAt,
			&user.FullName,
			&user.Username,
			&user.Email,
		)
		if err != nil {
			return nil, err
		}
		return &user, nil
	})
	if err != nil {
		return nil, getEmptyMetadata(filters.Page, filters.PageSize), err
	}

	return users, calculateMetadata(totalRecords, filters.Page, filters.PageSize), nil
}

func (m RoleModel) Create(ctx context.Context, roles Roles) error {
	return m.queries.CreateRoles(ctx, roles.ToStrings())
}
