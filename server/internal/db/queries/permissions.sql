-- name: GetAllPermissionsForUser :many
SELECT DISTINCT p.code
FROM permissions p
INNER JOIN role_permissions rp ON p.id = rp.permission_id
INNER JOIN user_roles ur ON rp.role_id = ur.role_id
WHERE ur.user_id = $1;

-- name: GetAllPermissionsForRole :many
SELECT p.code
FROM permissions p
INNER JOIN role_permissions rp ON rp.permission_id = p.id
WHERE rp.role_id = $1;

-- name: Create :exec
INSERT INTO permissions (code)
SELECT UNNEST($1::text[])
ON CONFLICT DO NOTHING;

-- name: AddPermissionsForRole :exec
INSERT INTO role_permissions (role_id, permission_id)
SELECT roles.id, permissions.id
FROM roles, permissions
WHERE roles.code = sqlc.arg(role_code) AND permissions.code = ANY(sqlc.arg(perm_codes)::text[])
ON CONFLICT DO NOTHING;

-- name: RemovePermissionsForRole :execresult
DELETE FROM role_permissions
WHERE (role_id, permission_id) IN (
  SELECT roles.id, permissions.id
  FROM roles, permissions
  WHERE roles.code = sqlc.arg(role_code) AND permissions.code = ANY(sqlc.arg(perm_codes)::text[])
);