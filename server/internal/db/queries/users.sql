-- name: InsertUser :one
INSERT INTO users (full_name, email, profile_image_url, password_hash, activated)
VALUES ($1, $2, $3, $4, $5)
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

-- name: GetUserForToken :one
SELECT users.*
FROM users
INNER JOIN tokens ON users.id = tokens.user_id
WHERE tokens.hash = $1
AND tokens.scope = $2
AND tokens.expiry > sqlc.arg(expiry_greater_than);

-- name: Update :one
UPDATE users 
SET full_name = $1, email = $2, profile_image_url = $3, password_hash = $4, activated = $5, updated_at = $6,
last_login_at = $7, version = version + 1
WHERE id = $8 AND version = $9
RETURNING version;