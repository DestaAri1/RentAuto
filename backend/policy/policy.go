package policy

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
)

var (
	ErrUnauthorized = errors.New("unauthorized access")
	ErrRoleNotFound = errors.New("role not found")
)

type Policy struct {
	roleRepo models.RoleRepository
}

func NewPolicy(roleRepo models.RoleRepository) *Policy {
	return &Policy{
		roleRepo: roleRepo,
	}
}

// CheckPermission checks if a role has the required permission
func (p *Policy) CheckPermission(ctx context.Context, roleId uuid.UUID, requiredPermission string) error {
	roles, err := p.roleRepo.GetRoles(ctx)
	if err != nil {
		return err
	}

	// Find the role by ID
	var targetRole *models.RoleResponse
	for _, role := range roles {
		if role.ID == roleId {
			targetRole = role
			break
		}
	}

	fmt.Println(targetRole)

	if targetRole == nil {
		return ErrRoleNotFound
	}

	// Administrator has all permissions
	if strings.ToLower(targetRole.Name) == "administrator" {
		return nil
	}

	// Check if the role has the required permission
	for _, permission := range targetRole.Permission {
		if strings.ToLower(permission) == strings.ToLower(requiredPermission) {
			return nil
		}
	}

	return ErrUnauthorized
}
