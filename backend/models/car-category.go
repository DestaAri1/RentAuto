package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarTypes struct {
	ID 		  uuid.UUID 	 `json:"id" gorm:"type:char(36);primaryKey"`
	Name 	  string 		 `json:"name" gorm:"not null"`
	UserId 	  uint 			 `json:"user_id" gorm:"not null"`
	User	  User 			 `json:"user" gorm:"foreignKey:UserId;references:ID;onDelete:cascade"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}