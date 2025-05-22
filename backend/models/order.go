package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Order struct {
	Id         uuid.UUID      `json:"id" gorm:"type:char(36);primaryKey"`
	IsActive   *bool          `json:"is_active" gorm:"default:false"`
	IsPickedUp *bool          `json:"is_picked_up" gorm:"default:false"`
	PayStatus  *bool          `json:"payment_status" gorm:"default:false"`
	UserId     uuid.UUID      `json:"user_id" gorm:"not null"`
	User       User           `json:"user" gorm:"foreignKey:UserId;references:ID;onDelete:cascade"`
	CarId      uuid.UUID      `json:"car_id" gorm:"not null"`
	Car        CarChild       `json:"car" gorm:"foreignKey:CarId;references:ID;onDelete:cascade"`
	Information string		  `json:"information" gorm:"not null;text"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
