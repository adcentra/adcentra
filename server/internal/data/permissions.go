package data

import (
	"context"
	"time"

	"slices"

	"adcentra.ai/internal/cache"
	"adcentra.ai/internal/db/sqlc"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PermCode string

const (
	PermDebugVarsView PermCode = "debugvars:view"
	PermAdminsView    PermCode = "admins:view"
	PermAdminsManage  PermCode = "admins:manage"
	PermUsersView     PermCode = "users:view"
	PermUsersManage   PermCode = "users:manage"
	PermRolesView     PermCode = "roles:view"
	PermRolesManage   PermCode = "roles:manage"
)

type Permissions []PermCode

func (p Permissions) ToStrings() []string {
	stringPerms := make([]string, len(p))
	for i, code := range p {
		stringPerms[i] = string(code)
	}
	return stringPerms
}

func (p *Permissions) FromStrings(strings []string) {
	for _, code := range strings {
		*p = append(*p, PermCode(code))
	}
}

func (p Permissions) Has(code PermCode) bool {
	return slices.Contains(p, code)
}

func (p Permissions) HasAll(codes ...PermCode) bool {
	for _, code := range codes {
		if !slices.Contains(p, code) {
			return false
		}
	}
	return true
}

func (p Permissions) HasAny(codes ...PermCode) bool {
	for _, code := range codes {
		if slices.Contains(p, code) {
			return true
		}
	}
	return false
}

type PermissionModel struct {
	pool    *pgxpool.Pool
	queries *sqlc.Queries
	cache   cache.Cache
}

const PermissionsCacheTTL = 5 * time.Minute

func (m PermissionModel) GetAllForUserCached(ctx context.Context, userID int64) Permissions {
	key := cache.GeneratePermissionsKey(userID)
	var permissions Permissions
	if cache.TryGet(ctx, m.cache, key, &permissions) {
		return permissions
	}

	return nil
}

func (m PermissionModel) SetAllForUserToCache(ctx context.Context, userID int64, permissions Permissions) {
	key := cache.GeneratePermissionsKey(userID)
	cache.TrySet(ctx, m.cache, key, permissions, PermissionsCacheTTL)
}

func (m PermissionModel) InvalidateAllForUserCache(ctx context.Context, userID int64) {
	key := cache.GeneratePermissionsKey(userID)
	cache.TryInvalidate(ctx, m.cache, key)
}

// Fetches all permissions of roles assigned to user
func (m PermissionModel) GetAllForUser(ctx context.Context, userID int64) (Permissions, error) {
	stringPerms, err := m.queries.GetAllPermissionsForUser(ctx, userID)

	var permissions Permissions
	permissions.FromStrings(stringPerms)
	return permissions, err
}

func (m PermissionModel) GetAllForRole(ctx context.Context, roleID int64) (Permissions, error) {
	stringPerms, err := m.queries.GetAllPermissionsForRole(ctx, roleID)

	var permissions Permissions
	permissions.FromStrings(stringPerms)
	return permissions, err
}

func (m PermissionModel) AddForRole(ctx context.Context, roleCode Role, permissions Permissions) error {
	return m.queries.AddPermissionsForRole(ctx, sqlc.AddPermissionsForRoleParams{
		RoleCode:  string(roleCode),
		PermCodes: permissions.ToStrings(),
	})
}

func (m PermissionModel) RemoveForRole(ctx context.Context, roleCode Role, permissions Permissions) error {
	result, err := m.queries.RemovePermissionsForRole(ctx, sqlc.RemovePermissionsForRoleParams{
		RoleCode:  string(roleCode),
		PermCodes: permissions.ToStrings(),
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

func (m PermissionModel) Create(ctx context.Context, permCodes Permissions) error {
	return m.queries.Create(ctx, permCodes.ToStrings())
}
