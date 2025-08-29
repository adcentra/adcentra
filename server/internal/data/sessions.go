package data

import (
	"context"
	"crypto/sha256"
	"errors"
	"time"

	"adcentra.ai/internal/db/sqlc"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Session struct {
	User          *User
	Token         *Token
	Roles         Roles
	PermissionMap map[PermCode]bool
}

type SessionModel struct {
	pool    *pgxpool.Pool
	queries *sqlc.Queries
}

func (m SessionModel) GetForToken(ctx context.Context, tokenPlainText string) (*Session, error) {
	tokenHash := sha256.Sum256([]byte(tokenPlainText))

	s, err := m.queries.GetSessionForToken(ctx, sqlc.GetSessionForTokenParams{
		Hash:              tokenHash[:],
		Scope:             ScopeAuthentication,
		ExpiryGreaterThan: pgtype.Timestamptz{Time: time.Now(), Valid: true},
	})

	var user User
	user.fromSQLCUser(s.User)
	var token Token
	token.fromSQLCToken(s.Token)
	var session Session
	session.User = &user
	session.Token = &token
	session.Token.Plaintext = tokenPlainText

	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &session, nil
}
