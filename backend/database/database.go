package database

import (
	// "github.com/DestaAri1/models"
	"github.com/DestaAri1/RentAuto/models"
	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init(DBMigrator func(db *gorm.DB) error) *gorm.DB {

	db, err := gorm.Open(mysql.Open("root:@/rentcar?charset=utf8mb4&parseTime=True&loc=Local"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Unable to connect DBL %e", err)
	}

	log.Info("Success connect DB")

	if err := DBMigrator(db); err != nil {
		log.Fatal("Unable to migrate table %e", err)
	}
	seedData(db)

	return db
}

func seedData(db *gorm.DB) {
	// 1. SEED ROLE
	roles := []models.Role{
		{
			ID:         uuid.New(),
			Name:       "administrator",
			Permission: []string{"all"},
		},
		{
			ID:         uuid.New(),
			Name:       "user",
			Permission: nil,
		},
	}

	for _, role := range roles {
		var existingRole models.Role
		result := db.First(&existingRole, "name = ?", role.Name)
		if result.RowsAffected == 0 {
			if err := db.Create(&role).Error; err != nil {
				log.Fatalf("Failed to create role: %v", err)
			}
		}
	}

	log.Info("Seeding roles completed!")

	// 2. AMBIL ROLE ADMIN UNTUK DIPAKAI PADA USER
	var adminRole models.Role
	if err := db.First(&adminRole, "name = ?", "Administrator").Error; err != nil {
		log.Fatalf("Failed to find role: %v", err)
	}

	var userRole models.Role
	if err := db.First(&userRole, "name = ?", "User").Error; err != nil {
		log.Fatalf("Failed to find role: %v", err)
	}

	// 3. SEED USER
	users := []models.User{
		{
			ID:       uuid.New(),
			Name:     "Admin Auto Rent",
			Email:    "admin@gmail.com",
			Password: hashPassword("12345678"),
			RoleID:   adminRole.ID,
		},
		{
			ID:       uuid.New(),
			Name:     "User Auto Rent",
			Email:    "user@gmail.com",
			Password: hashPassword("12345678"),
			RoleID:   userRole.ID,
		},
	}

	for _, user := range users {
		var existingUser models.User
		result := db.First(&existingUser, "email = ?", user.Email)
		if result.RowsAffected == 0 {
			if err := db.Create(&user).Error; err != nil {
				log.Fatalf("Failed to create user: %v", err)
			}
		}
	}

	log.Info("Seeding users completed!")
}


// Fungsi untuk hash password
func hashPassword(password string) string {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}
	return string(hashedPassword)
}

// func getRolePointer(role models.UserRole) *models.UserRole {
// 	return &role
// }
