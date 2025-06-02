package models

import (
	"context"
	"mime/multipart"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarParent struct {
	ID
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
	TimeStruct
}

type CarChild struct {
	ID
	Name        string         `json:"name" gorm:"not null"`
	Alias       string         `json:"alias" gorm:"not null"`
	Slug        string         `json:"slug" gorm:"not null"`
	Status      *int           `json:"status" gorm:"default:0"`
	IsActive    *bool          `json:"is_active" gorm:"default:false"`
	ImageURL    string         `json:"image_url"`
	Color       string         `json:"color" gorm:"not null"`
	CarParentId uuid.UUID      `json:"car_parent_id" default:"not null"`
	CarParent   CarParent      `json:"car_parent" gorm:"foreignKey:CarParentId;references:ID;onDelete:cascade"`
	Description string         `json:"description" gorm:"text"`
	TimeStruct
}

type FormCarParent struct {
	Name   string    `json:"name" validate:"required,max=100"`
	Price  float64   `json:"price" validate:"required,gt=0"`
	TypeId uuid.UUID `json:"type_id" validate:"required,uuid"`
	Seats  int       `json:"seats" validate:"required,min=1,max=100"`
}

type BaseFormCrChild struct {
	Name        string    `json:"name" validate:"required,max=100"`
	Alias       string    `json:"alias" validate:"required,max=100"`
	Status      *int      `json:"status" validate:"required,min=0,max=5"`
	Color       string    `json:"color" validate:"required,max=15"`
	Description string    `json:"description" validate:"required"`
	CarParentId uuid.UUID `json:"car_parent" validate:"required,uuid"`
	ImageFile *multipart.FileHeader `json:"-" form:"image"`
}

type FormCarChild struct {
	BaseFormCrChild
	Image     string                `json:"image" validate:"required"`
}

type FormUpdateCarChild struct {
	BaseFormCrChild
	Image     string                `json:"image" validate:"omitempty"`
}

type CarParentResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Unit        int       `json:"unit"`
	Available   int       `json:"available"`
	Price       float64   `json:"price"`
	Type        CarTypeResponses
	Seats       int `json:"seats"`
	Rating      int `json:"rating"`
	Unavailable int `json:"unavailable"`
}

type CarParentResponse2 struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
}

type CarChildResponse struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Alias       string    `json:"alias"`
	Slug        string    `json:"slug"`
	Status      *int      `json:"status"`
	Color       string    `json:"color"`
	Description string    `json:"description"`
	Image		string	  `json:"image_url"`
	IsActive	*bool	  `json:"is_active"`
	Parent 		CarParentResponse2
}

type CarRepository interface {
	GetCars(ctx context.Context) ([]*CarParentResponse, error)
	CreateCar(ctx context.Context, formData *FormCarParent, userId uuid.UUID) error
	UpdateCar(ctx context.Context, updateData map[string]interface{}, carId uuid.UUID, userId uuid.UUID) error
	DeleteCar(ctx context.Context, carId uuid.UUID) error
}

type CarChildRepository interface {
	GetCarChilds(ctx context.Context, carParentSlug string) ([]*CarChildResponse, error)
	GetOneCarChild(ctx context.Context, carChildSlug string) (*CarChildResponse, error)
	CreateCarChild(ctx context.Context, formData *FormCarChild, userId uuid.UUID) error
	UpdateCarChild(ctx context.Context, updateData map[string]interface{}, userId uuid.UUID, carChildId uuid.UUID) error
	DeleteCarChild(ctx context.Context, carChildId uuid.UUID) error
}

func (r *CarParent) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID.ID = uuid.New()
	return
}

func (r *CarChild) BeforeCreate(tx *gorm.DB) (err error) {
	r.ID.ID = uuid.New()
	return
}