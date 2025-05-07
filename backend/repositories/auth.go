package repository

import (
	"context"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func (r *AuthRepository) RegisterUser(ctx context.Context, registerData *models.AuthCredentials) (*models.User, error) {
	// Get default user role
	var role models.Role
	if err := r.db.Where("name = ?", "user").First(&role).Error; err != nil {
		return nil, err
	}
	
	user := &models.User{
		Name: registerData.Username,
		Email: registerData.Email,
		Password: registerData.Password,
		RoleID: role.ID,
	}

	if err := r.db.Create(user).Error; err != nil {
		return nil, err
	}

	// Load role data
	if err := r.db.Preload("Role").First(user, "id = ?", user.ID).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *AuthRepository) GetUser(ctx context.Context, query interface{}, args ...interface{}) (*models.User, error) {
	user := &models.User{}
	if err := r.db.Preload("Role").Where(query, args...).First(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (r *AuthRepository) GetUserWithRole(ctx context.Context, userId uuid.UUID, user *models.User) error {
	return r.db.Preload("Role").First(user, "id = ?", userId).Error
}

func NewAuthRepository(db *gorm.DB) models.AuthRepository {
	return &AuthRepository{
		db: db,
	}
}