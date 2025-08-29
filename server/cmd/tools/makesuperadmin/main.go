package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"adcentra.ai/internal/data"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	var (
		dsn      = flag.String("dsn", os.Getenv("DB_DSN"), "PostgreSQL connection string")
		username = flag.String("username", "", "Username of the user to make superadmin")
		revoke   = flag.Bool("revoke", false, "Flag to revoke superadmin permissions")
	)

	flag.Parse()

	if *username == "" {
		log.Fatal("Error: username is required")
	}

	pool, err := openDB(*dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	models := data.NewModels(pool, nil)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err := models.Users.GetByUsername(ctx, *username)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			log.Fatalf("Error: user %s not found", *username)
		}
		log.Fatalf("Error: %s", err)
	}

	if !user.Activated {
		log.Fatal("Error: user must be activated before granting them superadmin privileges")
	}

	err = models.Roles.Exists(ctx, data.RoleSuperAdmin)
	if err != nil {
		if errors.Is(err, data.ErrRecordNotFound) {
			log.Fatalf("Error: superadmin role not found")
		}
		log.Fatalf("Error: %s", err)
	}

	if *revoke {
		err = models.Roles.RemoveForUser(ctx, user.ID, data.Roles{data.RoleSuperAdmin})
		if err != nil {
			if errors.Is(err, data.ErrRecordNotFound) {
				log.Fatalf("Error: user %s does not have superadmin privileges", *username)
			}
			log.Fatalf("Error: %s", err)
		}

		fmt.Printf("Successfully revoked superadmin privileges from user: %s\n", *username)
	} else {
		err = models.Roles.AddForUser(ctx, user.ID, data.Roles{data.RoleSuperAdmin})
		if err != nil {
			if errors.Is(err, data.ErrUniqueConstraint) {
				log.Fatalf("Error: user %s already has superadmin privileges", *username)
			}
			log.Fatalf("Error: %s", err)
		}

		fmt.Printf("Successfully granted superadmin privileges to user: %s\n", *username)
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
