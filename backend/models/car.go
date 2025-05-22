package models

import (
	"context"
	"mime/multipart"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarParent struct {
	ID        uuid.UUID      `json:"id" gorm:"type:char(36);primaryKey"`
	Name      string         `json:"name" gorm:"not null"`
	Slug      string         `json:"slug" gorm:"not null"`
	Unit      int            `json:"unit" gorm:"not null"`
	Available int            `json:"available" gorm:"not null"`
	Price     float64        `json:"price" gorm:"not null"`
	TypeId    uuid.UUID      `json:"car_type_id" gorm:"not null"`
	Type      CarTypes       `json:"car_type" gorm:"foreignKey:TypeId;references:ID;onDelete:cascade"`
	Seats     int            `json:"seats" gorm:"not null"`
	Rating    int            `json:"rating" gorm:"default:0"`
	UserId    uuid.UUID      `json:"user_id" gorm:"not null"`
	User      User           `json:"user" gorm:"foreignKey:UserId;references:ID;onDelete:cascade"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type CarChild struct {
	ID          uuid.UUID      `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Alias       string         `json:"alias" gorm:"not null"`
	Slug        string         `json:"slug" gorm:"not null"`
	Status      *int           `json:"status" gorm:"default:0"`
	ImageURL    string         `json:"image_url"`
	Color       string		   `json:"color" gorm:"not null"`
	CarParentId uuid.UUID      `json:"car_parent_id" default:"not null"`
	CarParent   CarParent      `json:"car_parent" gorm:"foreignKey:CarParentId;references:ID;onDelete:cascade"`
	Description string		   `json:"description" gorm:"text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type FormCarParent struct {
	Name      string                `json:"name" validate:"required,max=100"`
	Price     float64               `json:"price" validate:"required,gt=0"`
	TypeId    uuid.UUID        		`json:"type_id" validate:"required,uuid"`
	Seats     int                   `json:"seats" validate:"required,min=1,max=100"`
}

type FormCarChild struct {
	Image     string                `json:"image" validate:"required"`
	ImageFile *multipart.FileHeader `json:"-" form:"image"`
}

type CarRepository interface {
	GetCars(ctx context.Context) ([]*CarParent, error)
	CreateCar(ctx context.Context, formData *FormCarParent, userId uuid.UUID) error
	UpdateCar(ctx context.Context, updateData map[string]interface{}, carId uuid.UUID, userId uuid.UUID) error
	DeleteCar(ctx context.Context, carId uuid.UUID) error
}

type CarChildRepository interface {
	GetCarChilds(ctx context.Context, carParentId uuid.UUID) ([]*CarChild, error)
	GetOneCarChild(ctx context.Context, carChildId uuid.UUID) (*CarChild, error)
	CreateCarChild(ctx context.Context, formData *FormCarChild, userId uuid.UUID) error
	UpdateCarChild(ctx context.Context, updateData map[string]interface{}, userId uuid.UUID, carChildId uuid.UUID) error
	DeleteCarChild(ctx context.Context, carChildId uuid.UUID) error

}

func (r *CarParent) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID = uuid.New()
	return
}