package repository

import (
	"context"
	"errors"
	"path/filepath"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarChildRepository struct {
	db *gorm.DB
}

func (r *CarChildRepository) GetCarChilds(ctx context.Context, carParentSlug string) ([]*models.CarChild, error) {
	carChild := []*models.CarChild{}

	var carParent models.CarParent
	checkCarParent := r.db.Model(&carParent).Where("slug = ? and deleted_at IS NULL", carParentSlug).First(&carParent)

	if checkCarParent.RowsAffected == 0 {
		return nil, errors.New("cannot find parent")
	}

	res := r.db.Model(&models.CarChild{}).Where("car_parent_id = ? AND deleted_at IS NULL", carParent.ID).Find(&carChild)

	if res.Error != nil {
		return nil, res.Error
	}

	return carChild, nil
}

func (r *CarChildRepository) GetOneCarChild(ctx context.Context, carChildId uuid.UUID) (*models.CarChild, error) {
	carChild := &models.CarChild{}

	checkCarChild := r.db.Model(carChild).Where("id = ?", carChildId).First(&carChild)
	if checkCarChild.RowsAffected == 0 {
		return nil, errors.New("id not found")
	}

	if checkCarChild.Error != nil {
		return nil, checkCarChild.Error
	}
	
	return carChild, nil
}

func (r *CarChildRepository) CreateCarChild(ctx context.Context, formData *models.FormCarChild, userId uuid.UUID) error {
	// Validate required fields first
	if formData == nil {
		return errors.New("form data is required")
	}

	// Begin transaction
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Check if car parent exists
	var carParent models.CarParent
	checkCarParentId := tx.Model(&models.CarParent{}).Where("id = ? AND deleted_at IS NULL", formData.CarParentId).First(&carParent)

	if checkCarParentId.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("car parent id not found")
	}

	if checkCarParentId.Error != nil {
		tx.Rollback()
		return checkCarParentId.Error
	}

	// Generate unique slug
	newSlug, err := utils.GenerateUniqueSlug(r.db, "car_children", "slug", formData.Name)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Create car child model
	carChild := &models.CarChild{
		Name:        formData.Name,
		Alias:       formData.Alias,
		Slug:        newSlug,
		Status:      formData.Status,
		ImageURL:    formData.Image,
		Color:       formData.Color,
		CarParentId: formData.CarParentId,
		Description: formData.Description,
	}

	// Create record in database
	if res := tx.Create(&carChild); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

func (r *CarChildRepository) UpdateCarChild(ctx context.Context, updateData map[string]interface{}, carChildId uuid.UUID, userId uuid.UUID) error {
	if len(updateData) == 0 {
		return errors.New("no data provided for update")
	}

	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Check if carParentId exists in updateData and validate it
	if carParentId, exists := updateData["car_parent_id"]; exists {
		var carParent models.CarParent
		checkCarParentId := tx.Model(&models.CarParent{}).Where("id = ? AND deleted_at IS NULL", carParentId).First(&carParent)

		if checkCarParentId.RowsAffected == 0 {
			tx.Rollback()
			return errors.New("car parent id not found")
		}

		if checkCarParentId.Error != nil {
			tx.Rollback()
			return checkCarParentId.Error
		}
	}

	// Get current car child
	var currentCarChild models.CarChild
	checkId := tx.Model(&currentCarChild).Where("id = ?", carChildId).First(&currentCarChild)

	if checkId.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("car child id not found")
	}

	if checkId.Error != nil {
		tx.Rollback()
		return checkId.Error
	}

	// Handle slug generation if name is being updated
	if name, ok := updateData["name"].(string); ok && name != "" {
		if name != currentCarChild.Name {
			newSlug, err := utils.GenerateUniqueSlug(r.db, "car_children", "slug", name)
			if err != nil {
				tx.Rollback()
				return err
			}
			updateData["slug"] = newSlug
		} else {
			// Remove slug from updateData if name is the same to prevent unnecessary update
			delete(updateData, "slug")
		}
	}

	// Handle image deletion if new image is provided
	if newImage, ok := updateData["image_url"].(string); ok && newImage != "" && currentCarChild.ImageURL != "" && currentCarChild.ImageURL != "default.png" {
		oldImagePath := filepath.Join("assets/car", currentCarChild.ImageURL)
		if err := utils.DeleteFile(oldImagePath); err != nil {
			// Log error but don't fail the transaction for file deletion
			// You might want to implement proper logging here
		}
	}

	// Update the record
	res := tx.Model(&models.CarChild{}).Where("id = ?", carChildId).Updates(updateData)

	if res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	if res.RowsAffected == 0 {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}

	return tx.Commit().Error
}

func (r *CarChildRepository) DeleteCarChild(ctx context.Context, carChildId uuid.UUID) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Soft delete menggunakan gorm
	res := tx.Where("id = ?", carChildId).Delete(&models.CarChild{})
	if res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	if res.RowsAffected == 0 {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}
	
	return tx.Commit().Error
}

func NewCarChildRepository(db *gorm.DB) models.CarChildRepository {
	return &CarChildRepository{db: db}
}