package cache

import (
	"fmt"
)

const (
	KeyPermissionsPrefix = "permissions:"
	KeyRolesPrefix       = "roles:"
)

func GeneratePermissionsKey(userID int64) string {
	return fmt.Sprintf("%s%d", KeyPermissionsPrefix, userID)
}

func GenerateRolesKey(userID int64) string {
	return fmt.Sprintf("%s%d", KeyRolesPrefix, userID)
}
