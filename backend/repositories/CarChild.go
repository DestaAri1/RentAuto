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

func (r *CarChildRepository) updateCarParentColumn(ctx context.Context, carParentId uuid.UUID, updates map[string]int) error {
	tx := r.db.WithContext(ctx).Model(&models.CarParent{}).Where("id = ?", carParentId)

	for column, value := range updates {
		if value > 0 {
			tx = tx.UpdateColumn(column, gorm.Expr(column+" + ?", value))
		} else if value < 0 {
			tx = tx.UpdateColumn(column, gorm.Expr(column+" - ?", -value))
		}
	}

	return tx.Error
}

func (r *CarChildRepository) GetCarChilds(ctx context.Context, carParentSlug string) ([]*models.CarChildResponse, error) {
	carChild := []*models.CarChild{}

	var carParent models.CarParent
	checkCarParent := r.db.Model(&carParent).Where("slug = ? and deleted_at IS NULL", carParentSlug).First(&carParent)

	if checkCarParent.RowsAffected == 0 {
		return nil, errors.New("cannot find parent")
	}

	res := r.db.Model(&models.CarChild{}).Where("car_parent_id = ? AND deleted_at IS NULL", carParent.ID.ID).Preload("CarParent").Find(&carChild)

	if res.Error != nil {
		return nil, res.Error
	}

	var carChildResponse []*models.CarChildResponse
	for _, carChild := range carChild {
		response := &models.CarChildResponse{
			ID: carChild.ID.ID,
			Name: carChild.Name,
			Alias: carChild.Alias,
			Status: carChild.Status,
			Color: carChild.Color,
			Description: carChild.Description,
			Parent: models.CarParentResponse2{
				ID: carChild.CarParent.TypeId,
				Name: carChild.CarParent.Name,
			},
		}

		carChildResponse = append(carChildResponse, response)
	}

	return carChildResponse, nil
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

	// Update car parent columns after successful creation
	updates := map[string]int{"unit": 1}
	if formData.Status != nil && *formData.Status == 1 {
		updates["available"] = 1
	}

	if err := r.updateCarParentColumn(ctx, formData.CarParentId, updates); err != nil {
		return err
	}

	return nil
}

func (r *CarChildRepository) UpdateCarChild(ctx context.Context, updateData map[string]interface{}, userId uuid.UUID, carChildId uuid.UUID) error {
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

	// Get current car child FIRST
	var currentCarChild models.CarChild
	checkId := tx.Model(&models.CarChild{}).Where("id = ?", carChildId).First(&currentCarChild)

	if checkId.RowsAffected == 0 {
		tx.Rollback()
		return errors.New("car child id not found")
	}

	if checkId.Error != nil {
		tx.Rollback()
		return checkId.Error
	}

	// Store original values for comparison
	originalStatus := 0
	if currentCarChild.Status != nil {
		originalStatus = *currentCarChild.Status
	}
	originalCarParentId := currentCarChild.CarParentId

	// Check if carParentId exists in updateData and validate it
	newCarParentId := originalCarParentId // Default to current parent
	if carParentId, exists := updateData["car_parent_id"]; exists {
		if carParentUUID, ok := carParentId.(uuid.UUID); ok {
			var carParent models.CarParent
			checkCarParentId := tx.Model(&models.CarParent{}).Where("id = ? AND deleted_at IS NULL", carParentUUID).First(&carParent)

			if checkCarParentId.RowsAffected == 0 {
				tx.Rollback()
				return errors.New("car parent id not found")
			}

			if checkCarParentId.Error != nil {
				tx.Rollback()
				return checkCarParentId.Error
			}
			newCarParentId = carParentUUID
		}
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

	if err := tx.Commit().Error; err != nil {
		return err
	}

	// Handle car parent updates after successful update
	newStatus := originalStatus // Default to original status
	if statusValue, exists := updateData["status"]; exists {
		if statusPtr, ok := statusValue.(*int); ok && statusPtr != nil {
			newStatus = *statusPtr
		} else if statusInt, ok := statusValue.(int); ok {
			newStatus = statusInt
		}
	}

	// Handle car parent changes
	if originalCarParentId != newCarParentId {
		// Moving to different parent
		// Decrease from old parent
		oldParentUpdates := map[string]int{"unit": -1}
		if originalStatus == 1 {
			oldParentUpdates["available"] = -1
		}
		if err := r.updateCarParentColumn(ctx, originalCarParentId, oldParentUpdates); err != nil {
			return err
		}

		// Increase to new parent
		newParentUpdates := map[string]int{"unit": 1}
		if newStatus == 1 {
			newParentUpdates["available"] = 1
		}
		if err := r.updateCarParentColumn(ctx, newCarParentId, newParentUpdates); err != nil {
			return err
		}
	} else {
		// Same parent, check status change
		if originalStatus != newStatus {
			updates := map[string]int{}
			
			// Status changed from available (1) to not available (!= 1)
			if originalStatus == 1 && newStatus != 1 {
				updates["available"] = -1
			}
			// Status changed from not available (!= 1) to available (1)
			if originalStatus != 1 && newStatus == 1 {
				updates["available"] = 1
			}

			if len(updates) > 0 {
				if err := r.updateCarParentColumn(ctx, originalCarParentId, updates); err != nil {
					return err
				}
			}
		}
	}

	return nil
}

func (r *CarChildRepository) DeleteCarChild(ctx context.Context, carChildId uuid.UUID) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Get car child data before deletion for parent update
	var carChild models.CarChild
	checkCarChild := tx.Model(&models.CarChild{}).Where("id = ?", carChildId).First(&carChild)
	if checkCarChild.RowsAffected == 0 {
		tx.Rollback()
		return gorm.ErrRecordNotFound
	}

	if checkCarChild.Error != nil {
		tx.Rollback()
		return checkCarChild.Error
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
	
	if err := tx.Commit().Error; err != nil {
		return err
	}

	// Update car parent after successful deletion
	updates := map[string]int{"unit": -1}
	if carChild.Status != nil && *carChild.Status == 1 {
		updates["available"] = -1
	}

	if err := r.updateCarParentColumn(ctx, carChild.CarParentId, updates); err != nil {
		return err
	}

	return nil
}

func NewCarChildRepository(db *gorm.DB) models.CarChildRepository {
	return &CarChildRepository{db: db}
}