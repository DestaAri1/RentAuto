package policy

import (
	"context"

	"github.com/google/uuid"
)

type RolePolicy struct {
	*Policy
}

func NewRolePolicy(policy *Policy) *RolePolicy {
	return &RolePolicy{
		Policy: policy,
	}
}

func (p *RolePolicy) CanViewRoles(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "view_roles")
}

func (p *RolePolicy) CanCreateRole(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "create_role")
}

// CanUpdateCar checks if a role can update cars
func (p *RolePolicy) CanUpdateRole(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "update_role")
}

// CanDeleteCar checks if a role can delete cars
func (p *RolePolicy) CanDeleteRole(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "delete_role")
}