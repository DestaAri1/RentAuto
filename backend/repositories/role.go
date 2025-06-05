package repository

import (
	"context"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func (r *RoleRepository) GetRoles(ctx context.Context) ([]*models.RoleResponse, error) {
	roles := []*models.Role{}
	
	res := r.db.Model(&models.Role{}).Where("deleted_at IS NULL").Find(&roles)
	if res.Error != nil {
		return nil, res.Error
	}

	roleResponses := []*models.RoleResponse{}
	for _, role := range roles {
		response := &models.RoleResponse{
			ID: role.ID,
			Name: role.Name,
			Permission: role.Permission,
		}
		roleResponses = append(roleResponses, response)
	}
	
	return roleResponses, nil
}

func (r *RoleRepository) CreateRole(ctx context.Context, formData *models.FormRole) error {
	role := &models.Role{
		Name:       formData.Name,
		Permission: formData.Permission,
	}

	tx := r.db.Begin()
	if res := tx.Create(role); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()
	return nil
}

func (r *RoleRepository) UpdateRole(ctx context.Context, formData *models.FormRole, roleId uuid.UUID) error {
	tx := r.db.Begin()
	
	updates := map[string]interface{}{
		"name":       formData.Name,
		"permission": formData.Permission,
	}

	if res := tx.Model(&models.Role{}).Where("id = ?", roleId).Updates(updates); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()
	return nil
}

func (r *RoleRepository) DeleteRole(ctx context.Context, roleId uuid.UUID) error {
	tx := r.db.Begin()
	
	if res := tx.Where("id = ?", roleId).Delete(&models.Role{}); res.Error != nil {
		tx.Rollback()
		return res.Error
	}
	
	tx.Commit()
	return nil
}

func NewRoleRepository(db *gorm.DB) models.RoleRepository {
	return &RoleRepository{
		db: db,
	}
} 