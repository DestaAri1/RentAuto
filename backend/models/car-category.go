package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarTypes struct {
	ID 		  uuid.UUID 	 `json:"id" gorm:"type:char(36);primaryKey"`
	Name 	  string 		 `json:"name" gorm:"not null"`
	UserId 	  uuid.UUID 	 `json:"user_id" gorm:"not null"`
	User	  User 			 `json:"user" gorm:"foreignKey:UserId;references:ID;onDelete:cascade"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type FormCarTypes struct {
	Name string `json:"name" validate:"required"`
}

type CarTypesRepository interface {
	GetCarType(ctx context.Context) ([]*CarTypes, error)
	CreateCarType(ctx context.Context, formData *FormCarTypes, userId uuid.UUID) error
	UpdateCarType(ctx context.Context, updateData map[string]interface{}, carTypeId uuid.UUID, userId uuid.UUID) error
	DeleteCarType(ctx context.Context, carTypeId uuid.UUID) error
}

func (r *CarTypes) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New()
	return
}