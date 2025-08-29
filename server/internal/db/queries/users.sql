-- name: InsertUser :one
INSERT INTO users (full_name, username, email, profile_image_url, password_hash, activated)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetUserByID :one
SELECT *
FROM users
WHERE id = $1
LIMIT 1;

-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1
LIMIT 1;

-- name: GetUserByUsername :one
SELECT *
FROM users
WHERE username = $1
LIMIT 1;

-- name: GetUserForToken :one
SELECT users.*
FROM users
INNER JOIN tokens ON users.id = tokens.user_id
WHERE tokens.hash = $1
AND tokens.scope = $2
AND tokens.expiry > sqlc.arg(expiry_greater_than);

-- name: HasUsername :one
SELECT count(1) > 0
FROM users
WHERE username = $1;

-- name: Update :one
UPDATE users 
SET full_name = $1, username = $2, email = $3, profile_image_url = $4, password_hash = $5, activated = $6, updated_at = $7,
last_login_at = $8, version = version + 1
WHERE id = $9 AND version = $10
RETURNING version;