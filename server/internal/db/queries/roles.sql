-- name: RoleExists :one
SELECT EXISTS(
  SELECT 1 FROM roles WHERE code = $1
);

-- name: GetAllRolesForUser :many
SELECT DISTINCT r.code
FROM roles r
INNER JOIN user_roles ur ON r.id = ur.role_id
WHERE ur.user_id = $1;

-- name: AddRolesForUser :exec
INSERT INTO user_roles (user_id, role_id)
SELECT $1, roles.id FROM roles WHERE roles.code = ANY(sqlc.arg(role_codes)::text[]);

-- name: RemoveRolesForUser :execresult
DELETE FROM user_roles
WHERE user_id = $1 AND role_id = ANY(
  SELECT id FROM roles WHERE code = ANY(sqlc.arg(role_codes)::text[])
);

-- name: CreateRoles :exec
INSERT INTO roles (code)
SELECT UNNEST(sqlc.arg(role_codes)::text[])
ON CONFLICT DO NOTHING;