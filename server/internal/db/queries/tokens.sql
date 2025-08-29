-- name: InsertToken :one
INSERT INTO tokens (hash, user_id, expiry, scope)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: DeleteAllForUser :exec
DELETE FROM tokens
WHERE scope = $1 AND user_id = $2;

-- name: DeleteAllForUserExceptHash :exec
DELETE FROM tokens
WHERE scope = $1 AND user_id = $2 AND hash != $3;

-- name: DeleteByHash :exec
DELETE FROM tokens
WHERE hash = $1;

-- name: DeleteExpiredTokens :exec
DELETE FROM tokens
WHERE expiry < NOW();