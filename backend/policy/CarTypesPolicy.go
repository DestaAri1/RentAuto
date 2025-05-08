package policy

import (
	"context"

	"github.com/google/uuid"
)

type CarTypesPolicy struct {
	*Policy
}

func NewCarTypesPolicy(policy *Policy) *CarTypesPolicy {
	return &CarTypesPolicy{
		Policy: policy,
	}
}

// CanCreateCar checks if a role can create cars
func (p *CarTypesPolicy) CanCreateCarTypes(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "create_car_types")
}

// CanUpdateCar checks if a role can update cars
func (p *CarTypesPolicy) CanUpdateCarTypes(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "update_car_types")
}

// CanDeleteCar checks if a role can delete cars
func (p *CarTypesPolicy) CanDeleteCarTypes(ctx context.Context, roleId uuid.UUID) error {
	return p.CheckPermission(ctx, roleId, "delete_car_types")
}