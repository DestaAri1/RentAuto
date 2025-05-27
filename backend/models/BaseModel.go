package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ID struct {
	ID uuid.UUID `json:"id" gorm:"type:char(36);primaryKey"`
}

type TimeStruct struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
