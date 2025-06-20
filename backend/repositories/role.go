package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func (r *RoleRepository) GetRoles(ctx context.Context) ([]*models.RoleResponse, error) {
	roles := []*models.Role{}
	
	res := r.db.Find(&roles)
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
	data := strings.ToLower(formData.Name)
	if data == "administrator" || data == "admin" || data == "user" {
		return fmt.Errorf("cannot create role with name: %s", data)
	}

	role := &models.Role{
		Name:       strings.ToLower(formData.Name),
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

	// Konversi slice ke JSON string
	permissionJSON, err := json.Marshal(formData.Permission)
	if err != nil {
		tx.Rollback()
		return err
	}

	updates := map[string]interface{}{
		"name":       strings.ToLower(formData.Name),
		"permission": string(permissionJSON), // simpan sebagai string JSON
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

	var checkRole models.Role
	res := tx.Model(&models.Role{}).Where("id = ?", roleId).First(&checkRole)
	if res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	if checkRole.Name == "Administrator" || checkRole.Name == "User" {
		tx.Rollback()
		return errors.New("Immune role")
	}

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