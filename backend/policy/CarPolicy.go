package policy

import (
	"context"

	"github.com/google/uuid"
)

type CarPolicy struct {
	*Policy
}

func NewCarPolicy(policy *Policy) *CarPolicy {
	return &CarPolicy{
		Policy: policy,
	}
}

func (p *CarPolicy) CanEditCar(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "edit_car")
}

// CanCreateCar checks if a role can create cars
func (p *CarPolicy) CanCreateCar(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "create_car")
}

// CanUpdateCar checks if a role can update cars
func (p *CarPolicy) CanUpdateCar(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "update_car")
}

// CanDeleteCar checks if a role can delete cars
func (p *CarPolicy) CanDeleteCar(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "delete_car")
}