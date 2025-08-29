package data

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"errors"
	"strconv"
	"strings"
	"time"

	"adcentra.ai/internal/db/sqlc"
	"adcentra.ai/internal/validator"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrDuplicateEmail    = errors.New("duplicate email")
	ErrDuplicateUsername = errors.New("duplicate username")
)

type User struct {
	Base

	ID              int64              `json:"id"`
	FullName        string             `json:"full_name"`
	Username        string             `json:"username"`
	Email           string             `json:"email,omitzero"`
	ProfileImageURL pgtype.Text        `json:"profile_image_url,omitzero"`
	Password        password           `json:"-"`
	Activated       bool               `json:"activated,omitzero"`
	Version         int32              `json:"-"`
	LastLoginAt     pgtype.Timestamptz `json:"last_login_at,omitzero"`
}

func (user *User) fromSQLCUser(u sqlc.User) {
	*user = User{
		Base: Base{
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		},
		ID:              u.ID,
		FullName:        u.FullName,
		Username:        u.Username,
		Email:           u.Email,
		Password:        password{hash: u.PasswordHash},
		ProfileImageURL: u.ProfileImageUrl,
		Activated:       u.Activated,
		Version:         u.Version,
		LastLoginAt:     u.LastLoginAt,
	}
}

type password struct {
	// using pointer instead of string for plaintext to distinguish between
	// password not provided and password being empty string "".
	plaintext *string
	hash      []byte
}

func (p *password) Set(plaintextPassword string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(plaintextPassword), 12)
	if err != nil {
		return err
	}

	p.plaintext = &plaintextPassword
	p.hash = hash

	return nil
}

func (p *password) SetOAuthPasswordPlaceholder() {
	// Create a valid bcrypt hash that won't match any password
	p.Set(rand.Text())
	p.plaintext = nil
}

func (p *password) Matches(plaintextPassword string) (bool, error) {
	err := bcrypt.CompareHashAndPassword(p.hash, []byte(plaintextPassword))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			return false, nil
		default:
			return false, err
		}
	}
	return true, err
}

// When a user does not exist, DummyMatch() is used to prevent timing attacks on username/email.
func (p *password) DummyMatches(plaintextPassword string) {
	p.hash = []byte("$2a$12$otsImdHOADAlVBJldO3tneviC3T2SZ4noMGbf3ZnjA1XxwF0bJuwa")
	bcrypt.CompareHashAndPassword(p.hash, []byte(plaintextPassword))
}

func ValidateUsername(v *validator.Validator, username string) {
	v.Check(validator.NotBlank(username), "username", "Username must be provided")
	v.Check(validator.MinChars(username, 8), "username", "Username must be atleast 8 characters long")
	v.Check(validator.MaxChars(username, 16), "username", "Username must not be more than 16 characters long")
	v.Check(
		validator.Matches(username, validator.UsernameBasicRX),
		"username",
		`Username must contain only alphanumeric characters, dots and dashes`,
	)

	forbiddenPrefixes := []string{".", "_"}
	v.Check(
		validator.SafePrefix(username, forbiddenPrefixes...),
		"username",
		`Username must not start with "." or "_"`,
	)

	forbiddenSuffixes := []string{".", "_"}
	v.Check(
		validator.SafeSuffix(username, forbiddenSuffixes...),
		"username",
		`Username must not end with "." or "_"`,
	)

	forbiddenSubstrings := []string{"..", "__", "._", "_."}
	v.Check(
		validator.SafeSubstrings(username, forbiddenSubstrings...),
		"username",
		`Username must not contain consecutive "." or "_" or a combination of those`,
	)
}

func ValidateEmail(v *validator.Validator, email string) {
	v.Check(validator.NotBlank(email), "email", "Email must be provided")
	v.Check(validator.Matches(email, validator.EmailRX), "email", "Email must be a valid email address")
}

func ValidatePasswordPlaintext(v *validator.Validator, password string) {
	v.Check(validator.NotBlank(password), "password", "Password must be provided")
	v.Check(validator.MinChars(password, 8), "password", "Password must be at least 8 characters long")
	v.Check(validator.MaxChars(password, 72), "password", "Password must not be more than 72 characters long")
	v.Check(validator.Matches(password, validator.HasLowerRX), "password", "Password must have atleast 1 lower-case character")
	v.Check(validator.Matches(password, validator.HasUpperRX), "password", "Password must have atleast 1 upper-case character")
	v.Check(validator.Matches(password, validator.HasSpecialRX), "password", "Password must have atleast 1 special character (! @ # $ & *)")
	v.Check(validator.Matches(password, validator.HasDigitRX), "password", "Password must have atleast 1 numeric character")
}

func ValidateUser(v *validator.Validator, user *User) {
	v.Check(validator.NotBlank(user.FullName), "full_name", "Full name must be provided")
	v.Check(validator.MaxChars(user.FullName, 32), "full_name", "Full name must not be more than 32 characters long")

	ValidateUsername(v, user.Username)
	ValidateEmail(v, user.Email)

	if user.Password.plaintext != nil {
		ValidatePasswordPlaintext(v, *user.Password.plaintext)
	}

	// If the password hash is ever nil, this will be due to a logic error in our
	// codebase (probably because we forgot to set a password for the user). It's a
	// useful sanity check to include here, but it's not a problem with the data
	// provided by the client. So rather than adding an error to the validation map we
	// raise a panic instead.
	if user.Password.hash == nil {
		panic("missing password hash for user")
	}
}

var AnonymousUser = &User{}

func (u *User) IsAnonymous() bool {
	return u == AnonymousUser
}

type UserModel struct {
	pool    *pgxpool.Pool
	queries *sqlc.Queries
}

func (m UserModel) Insert(ctx context.Context, user *User) error {
	insertedUser, err := m.queries.InsertUser(ctx, sqlc.InsertUserParams{
		FullName:        user.FullName,
		Username:        user.Username,
		Email:           user.Email,
		ProfileImageUrl: user.ProfileImageURL,
		PasswordHash:    user.Password.hash,
		Activated:       user.Activated,
	})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			if pgErr.Code == strconv.Itoa(23505) && strings.Contains(pgErr.ConstraintName, "users_email_key") {
				return ErrDuplicateEmail
			} else if pgErr.Code == strconv.Itoa(23505) && strings.Contains(pgErr.ConstraintName, "users_username_key") {
				return ErrDuplicateUsername
			}
		}
		return err
	}

	user.ID = insertedUser.ID
	user.LastLoginAt = insertedUser.LastLoginAt
	user.CreatedAt = insertedUser.CreatedAt
	user.UpdatedAt = insertedUser.UpdatedAt
	user.Version = insertedUser.Version
	return nil
}

func (m UserModel) GetByID(ctx context.Context, id int64) (*User, error) {
	u, err := m.queries.GetUserByID(ctx, id)
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	var user User
	user.fromSQLCUser(u)
	return &user, nil
}

func (m UserModel) GetByEmail(ctx context.Context, email string) (*User, error) {
	u, err := m.queries.GetUserByEmail(ctx, email)

	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	var user User
	user.fromSQLCUser(u)
	return &user, nil
}

func (m UserModel) GetByUsername(ctx context.Context, username string) (*User, error) {
	u, err := m.queries.GetUserByUsername(ctx, username)

	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	var user User
	user.fromSQLCUser(u)
	return &user, nil
}

func (m UserModel) GetForToken(ctx context.Context, scope, tokenPlaintext string) (*User, error) {
	tokenHash := sha256.Sum256([]byte(tokenPlaintext))

	u, err := m.queries.GetUserForToken(ctx, sqlc.GetUserForTokenParams{
		Hash:              tokenHash[:],
		Scope:             scope,
		ExpiryGreaterThan: pgtype.Timestamptz{Time: time.Now(), Valid: true},
	})
	if err != nil {
		switch {
		case errors.Is(err, pgx.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	var user User
	user.fromSQLCUser(u)
	return &user, nil
}

func (m UserModel) HasUsername(ctx context.Context, username string) (bool, error) {
	return m.queries.HasUsername(ctx, username)
}

func (m UserModel) Update(ctx context.Context, user *User) error {
	version, err := m.queries.Update(ctx, sqlc.UpdateParams{
		FullName:        user.FullName,
		Username:        user.Username,
		Email:           user.Email,
		ProfileImageUrl: user.ProfileImageURL,
		PasswordHash:    user.Password.hash,
		Activated:       user.Activated,
		UpdatedAt:       pgtype.Timestamptz{Time: time.Now(), Valid: true},
		LastLoginAt:     user.LastLoginAt,
		Version:         user.Version,
		ID:              user.ID,
	})
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			if pgErr.Code == strconv.Itoa(23505) && strings.Contains(pgErr.ConstraintName, "users_email_key") {
				return ErrDuplicateEmail
			} else if pgErr.Code == strconv.Itoa(23505) && strings.Contains(pgErr.ConstraintName, "users_username_key") {
				return ErrDuplicateUsername
			}
		} else if errors.Is(err, pgx.ErrNoRows) {
			return ErrEditConflict
		}
		return err
	}

	user.Version = version

	return nil
}
