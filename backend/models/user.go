package models

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID          uuid.UUID      `json:"id" gorm:"type:char(36);primaryKey"`
	Name        string         `json:"name" gorm:"not null"`
	Email       string         `json:"email" gorm:"unique;not null"`
	Password    string         `json:"-"`
	RoleID      uuid.UUID      `json:"role_id" gorm:"not null"`
	Role        Role           `json:"role" gorm:"foreignKey:RoleID;references:ID;onDelete:cascade"`
	IsProtected bool           `json:"is_protected" gorm:"default:false"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

type UserForm struct {
	Name  string    `json:"name" validate:"required"`
	Email string    `json:"email" validate:"required,email,omitempty"`
	Role  uuid.UUID `json:"role" validate:"required,uuid"`
}

type CreateUserForm struct {
	UserForm
	Password string `json:"password" validate:"required"`
}

type UpdateUserForm struct {
	UserForm
	Password string `json:"password"`
}

type UserResponse struct {
	ID       uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
	Name     string    `json:"name" gorm:"not null"`
	Email    string    `json:"email" gorm:"unique;not null"`
	Password string    `json:"-"`
	Role     RoleResponse
}

type UserRepository interface {
	GetAllUser(ctx context.Context) ([]*UserResponse, error)
	CreateUser(ctx context.Context, formData *CreateUserForm) error
	UpdateUser(ctx context.Context, updateData map[string]interface{}, userId uuid.UUID) error
	DeleteUser(ctx context.Context, userId uuid.UUID) error
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	u.ID = uuid.New()
	return
}
