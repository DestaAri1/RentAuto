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

// CanViewCars checks if a role can view cars
func (p *CarPolicy) CanViewCars(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "view_cars")
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