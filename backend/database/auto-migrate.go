package database

import (
	"github.com/DestaAri1/RentAuto/models"
	"gorm.io/gorm"
)

func DBMigrator(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.Role{},
		&models.CarTypes{},
		&models.CarParent{},
		&models.CarChild{},
	)
}