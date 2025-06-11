package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) models.UserRepository{
	return &UserRepository{db: db}
}

func (r *UserRepository) GetAllUser(ctx context.Context) ([]*models.UserResponse, error) {
	users := []*models.User{}
	res := r.db.Model(&models.User{}).Where("deleted_at IS NULL").Preload("Role").Find(&users)
	if res.Error != nil {
		return nil, res.Error
	}

	userResponses := []*models.UserResponse{}
	for _, user := range users {
		response := &models.UserResponse{
			ID: user.ID,
			Name: user.Name,
			Email: user.Email,
			Role: models.RoleResponse{
				ID: user.Role.ID,
				Name: user.Role.Name,
				Permission: user.Role.Permission,
			},
		}
		userResponses = append(userResponses, response)
	}
	return userResponses, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, formData *models.CreateUserForm) error {
	ban := formData.Name

	if ban == "administrator" || ban == "admin" || ban == "user" {
		return fmt.Errorf("Cannot create %v", ban)
	}

	tx := r.db.Begin()

	var existingUser models.User
	if err := tx.Where("email = ?", formData.Email).First(&existingUser).Error; err == nil {
		tx.Rollback()
		return errors.New("This email is already used")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		tx.Rollback()
		return err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(formData.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	newUser := models.User{
		Name:     formData.Name,
		Email:    formData.Email,
		Password: string(hashedPassword),
		RoleID:   formData.Role,
	}

	if err := tx.Create(&newUser).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}


func (r *UserRepository) UpdateUser(ctx context.Context, updateData map[string]interface{}, userId uuid.UUID) error {
	tx := r.db.Begin()

	var existingUser models.User
	if err := tx.Unscoped().Where("id = ? AND deleted_at IS NULL", userId).First(&existingUser).Error; err != nil {
		tx.Rollback()
		return errors.New("user not found or already deleted")
	}

	if email, ok := updateData["email"]; ok && email != existingUser.Email {
		tx.Rollback()
		return errors.New("you cannot change the email")
	}

	res := tx.Model(&models.User{}).Where("id = ?", userId).Updates(updateData)
	if res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	if res.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("no changes were made to the user")
	}

	return tx.Commit().Error
}

func (r *UserRepository) DeleteUser(ctx context.Context, userId uuid.UUID) error {
	tx := r.db.Begin()

	var existingUser models.User
	if err := tx.Unscoped().Where("id = ? AND deleted_at IS NULL", userId).First(&existingUser).Error; err != nil {
		tx.Rollback()
		return errors.New("user not found or already deleted")
	}

	if existingUser.IsProtected {
		tx.Rollback()
		return errors.New("Cannot delete this user")
	}

	res := tx.Where("id = ?", userId).Delete(&models.User{})
	if res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	if res.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("no user was deleted")
	}

	return tx.Commit().Error
}