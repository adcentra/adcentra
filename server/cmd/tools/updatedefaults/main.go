package main

import (
	"context"
	"flag"
	"log"
	"os"
	"time"

	"adcentra.ai/internal/data"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	defaultPermissions = data.Permissions{
		data.PermDebugVarsView,
		data.PermAdminsView,
		data.PermAdminsManage,
		data.PermUsersView,
		data.PermUsersManage,
		data.PermRolesView,
		data.PermRolesManage,
	}

	defaultRoles = []data.Role{
		data.RoleSuperAdmin,
		data.RoleAdmin,
		data.RoleUser,
	}

	defaultRolePermissions = map[data.Role]data.Permissions{
		data.RoleAdmin: {
			data.PermAdminsView,
			data.PermAdminsManage,
			data.PermUsersView,
			data.PermUsersManage,
			data.PermRolesView,
			data.PermRolesManage,
		},
		data.RoleUser: {},
	}
)

func main() {
	var (
		dsn             = flag.String("dsn", os.Getenv("DB_DSN"), "PostgreSQL connection string")
		roles           = flag.Bool("roles", false, "Flag to update roles")
		permissions     = flag.Bool("permissions", false, "Flag to update permissions")
		rolePermissions = flag.Bool("role-permissions", false, "Flag to update role permissions mapping")
		all             = flag.Bool("all", false, "Flag to update all defaults")
	)

	flag.Parse()

	if !(*roles || *permissions || *rolePermissions || *all) {
		log.Fatal("Please provide at least one of the following flags: -roles, -permissions, -role-permissions, -all")
	}

	pool, err := openDB(*dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	models := data.NewModels(pool, nil)

	if *permissions || *all {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		err = models.Permissions.Create(ctx, defaultPermissions)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("Permissions updated")
	}

	if *roles || *all {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
		defer cancel()

		err = models.Roles.Create(ctx, defaultRoles)
		if err != nil {
			log.Fatal(err)
		}
		log.Println("Roles updated")
	}

	if *rolePermissions || *all {
		for _, role := range defaultRoles {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			err = models.Permissions.AddForRole(ctx, role, defaultRolePermissions[role])
			if err != nil {
				log.Fatal(err)
			}
		}
		log.Println("Role permissions mapping updated")
	}
}

func openDB(dsn string) (*pgxpool.Pool, error) {
	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, err
	}

	err = pool.Ping(ctx)
	if err != nil {
		pool.Close()
		return nil, err
	}

	return pool, nil
}
