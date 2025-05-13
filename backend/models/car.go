package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Car struct {
	ID        uuid.UUID      `json:"id" gorm:"type:char(36);primaryKey"`
	Name      string         `json:"name" gorm:"not null"`
	Unit	  int			 `json:"unit" gorm:"not null"`
	Available int			 `json:"available" gorm:"not null"`
	Price     float64        `json:"price" gorm:"not null"`
	TypeId    uuid.UUID      `json:"car_type_id" gorm:"not null"`
	Type      CarTypes       `json:"car_type" gorm:"foreignKey:TypeId;references:ID;onDelete:cascade"`
	Seats     int            `json:"seats" gorm:"not null"`
	ImageURL  string         `json:"image_url"`
	Rating	  int			 `json:"rating" gorm:"default:0"`
	UserId 	  uuid.UUID 	 `json:"user_id" gorm:"not null"`
	User	  User 			 `json:"user" gorm:"foreignKey:UserId;references:ID;onDelete:cascade"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type FormCar struct {
	Name   string    `json:"name" validate:"required,max=100"`
	Unit   int		 `json:"unit" validate:"required,min=1"`
	Price  float64   `json:"price" validate:"required,gt=0"`
	TypeId uuid.UUID `json:"type_id" validate:"required,uuid"`
	Seats  int       `json:"seats" validate:"required,min=1,max=100"`
	Rating int       `json:"rating" validate:"required,min=1,max=5"`
}

type CarRepository interface {
	GetCars(ctx context.Context) ([]*Car, error)
	CreateCar(ctx context.Context, formData *FormCar) error
	UpdateCar(ctx context.Context, updateData map[string]interface{}, carId uuid.UUID) error
	DeleteCar(ctx context.Context, carId uuid.UUID) error
}