package policy

import (
	"context"
	"strings"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
)

type AdminPolicy struct {
	*Policy
}

func NewAdminPolicy(policy *Policy) *AdminPolicy {
	return &AdminPolicy{
		Policy: policy,
	}
}

// IsAdmin checks if the provided roleId belongs to an administrator
func (p *AdminPolicy) IsAdmin(ctx context.Context, roleId uuid.UUID) (bool, error) {
	roles, err := p.roleRepo.GetRoles(ctx)
	if err != nil {
		return false, err
	}

	// Find the role by ID
	var targetRole *models.RoleResponse
	for _, role := range roles {
		if role.ID == roleId {
			targetRole = role
			break
		}
	}

	if targetRole == nil {
		return false, ErrRoleNotFound
	}

	// Check if the role is administrator
	return strings.ToLower(targetRole.Name) == "administrator", nil
}

// RequireAdmin ensures the user has administrator role
func (p *AdminPolicy) RequireAdmin(ctx context.Context, roleId uuid.UUID) error {
	isAdmin, err := p.IsAdmin(ctx, roleId)
	if err != nil {
		return err
	}

	if !isAdmin {
		return ErrUnauthorized
	}

	return nil
}

// CanManageRoles checks if a role can manage roles (admin only)
func (p *AdminPolicy) CanManageRoles(ctx context.Context, roleId uuid.UUID) error {
	return p.RequireAdmin(ctx, roleId)
}

// CanManageUsers checks if a role can manage users (admin only)
func (p *AdminPolicy) CanManageUsers(ctx context.Context, roleId uuid.UUID) error {
	return p.RequireAdmin(ctx, roleId)
}

// CanViewSystemLogs checks if a role can view system logs (admin only)
func (p *AdminPolicy) CanViewSystemLogs(ctx context.Context, roleId uuid.UUID) error {
	return p.RequireAdmin(ctx, roleId)
}

// CanManageSystemSettings checks if a role can manage system settings (admin only)
func (p *AdminPolicy) CanManageSystemSettings(ctx context.Context, roleId uuid.UUID) error {
	return p.RequireAdmin(ctx, roleId)
}