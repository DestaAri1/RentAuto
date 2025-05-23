package repository

import (
	"context"
	"errors"
	// "path/filepath"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/utils"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarRepository struct {
	db *gorm.DB
}

func (r *CarRepository) GetCars(ctx context.Context) ([]*models.CarParentResponse, error) {
	cars := []*models.CarParent{}

	res := r.db.Model(&models.CarParent{}).Where("deleted_at IS NULL").Preload("Type").Find(&cars)

	if res.Error != nil {
		return nil, res.Error
	}

	// Convert ke CarParentResponse
	var responses []*models.CarParentResponse
	for _, car := range cars {
		response := &models.CarParentResponse{
			ID:        car.ID,
			Name:      car.Name,
			Slug:      car.Slug,
			Unit:      car.Unit,
			Available: car.Available,
			Price:     car.Price,
			Type: models.CarTypeResponses{
				ID:   car.Type.ID,
				Name: car.Type.Name,
			},
			Seats:  car.Seats,
			Rating: car.Rating,
		}
		responses = append(responses, response)
	}

	return responses, nil
}

func (r *CarRepository) CreateCar(ctx context.Context, formData *models.FormCarParent, userId uuid.UUID) error {
	newSlug, err := utils.GenerateUniqueSlug(r.db, "car_parents", "slug", formData.Name)
	if err != nil {
		return err
	}
	
	cars := &models.CarParent{
		Name: formData.Name,
		Slug: newSlug,
		Price: formData.Price,
		TypeId: formData.TypeId,
		Seats: formData.Seats,

		UserId: userId,
		// ImageURL: formData.Image,
	}

	tx := r.db.Begin()

	checkType := tx.Model(&models.CarTypes{}).Where("id = ?", formData.TypeId).First(&models.CarTypes{})

	if checkType.RowsAffected == 0 {
		return errors.New("type id not found")
	}

	if checkType.Error != nil {
		return checkType.Error
	}

	if res := tx.Create(&cars); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()
	return nil
}

func (r *CarRepository) UpdateCar(ctx context.Context, updateData map[string]interface{}, carId uuid.UUID, userId uuid.UUID) error {
	if len(updateData) == 0 {
		return errors.New("no data provided for update")
	}

	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	checkType := tx.Model(&models.CarTypes{}).Where("id = ?", updateData["type_id"]).First(&models.CarTypes{})

	if checkType.RowsAffected == 0 {
		return errors.New("type id not found")
	}

	if checkType.Error != nil {
		return checkType.Error
	}
	
	var currentCar models.CarParent
	checkId := tx.Model(&currentCar).Where("id = ?", carId).First(&currentCar)

	if checkId.RowsAffected == 0 {
		return errors.New("id not found")
	}

	if err := tx.First(&currentCar, "id = ?", carId).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Only update slug if name is different from current name
	if name, ok := updateData["name"].(string); ok && name != "" {
		if name != currentCar.Name {
			newSlug, err := utils.GenerateUniqueSlug(r.db, "car_parents", "slug", name)
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

	// if newImage, ok := updateData["image_url"].(string); ok && newImage != "" && currentCar.ImageURL != "" {
	// 	oldImagePath := filepath.Join("assets/car", currentCar.ImageURL)
	// 	if err := utils.DeleteFile(oldImagePath); err != nil {
	// 		tx.Rollback()
	// 		return err
	// 	}
	// }

	res := tx.Model(&models.CarParent{}).Where("id = ?", carId).Updates(updateData)

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

func (r *CarRepository) DeleteCar(ctx context.Context, carId uuid.UUID) error {
	tx := r.db.Begin()
	
	// Soft delete menggunakan gorm
	if res := tx.Where("id = ?", carId).Delete(&models.CarParent{}); res.Error != nil {
		tx.Rollback()
		return res.Error
	}
	
	tx.Commit()
	return nil
}

func NewCarRepository(db *gorm.DB) models.CarRepository {
	return &CarRepository{
		db: db,
	}
}