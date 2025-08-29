package data

import "github.com/jackc/pgx/v5/pgtype"

type Base struct {
	CreatedAt pgtype.Timestamptz `json:"-"`
	UpdatedAt pgtype.Timestamptz `json:"-"`
}
