-- name: GetSessionForToken :one
SELECT sqlc.embed(users), sqlc.embed(tokens)
FROM users
INNER JOIN tokens ON users.id = tokens.user_id
WHERE tokens.hash = $1
AND tokens.scope = $2
AND tokens.expiry > sqlc.arg(expiry_greater_than);