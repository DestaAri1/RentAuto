package models

import (
	"time"

	"gorm.io/gorm"
)

type Role struct {
	ID         uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Name       string         `json:"name" gorm:"unique;not null"`
	Permission []string 	  `json:"permission" gorm:"type:json;serializer:json"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at"`
}