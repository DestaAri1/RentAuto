package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role struct {
	ID         uuid.UUID      `json:"id" gorm:"type:char(36);primaryKey"`
	Name       string         `json:"name" gorm:"unique;not null"`
	Permission []string       `json:"permission" gorm:"type:json;serializer:json"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at"`
}

type FormRole struct {
	Name	   string 	`json:"name" validate:"required"`
	Permission []string `json:"permission" validate:"required,dive,required"`
}

type RoleResponse struct {
	ID         uuid.UUID      `json:"id"`
	Name       string         `json:"name"`
	Permission []string       `json:"permission"`
}

type RoleRepository interface {
	GetRoles(ctx context.Context) ([]*RoleResponse, error)
	CreateRole(ctx context.Context, formData *FormRole) error
	UpdateRole(ctx context.Context, formData *FormRole, roleId uuid.UUID) error
	DeleteRole(ctx context.Context, roleId uuid.UUID) error
}

func (r *Role) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New()
	return
}