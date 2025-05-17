package repository

import (
	"context"
	"errors"
	"path/filepath"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/utils"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"gorm.io/gorm"
)

type CarRepository struct {
	db *gorm.DB
}

func (r *CarRepository) GetCars(ctx context.Context) ([]*models.Car, error) {
	cars := []*models.Car{}

	res := r.db.Model(&models.Car{}).Where("deleted_at IS NULL").Preload("Type").Find(&cars)

	if res.Error != nil {
		return nil, res.Error
	}
	return cars, nil
}

func (r *CarRepository) GetOneCar(ctx context.Context, carId uuid.UUID) (*models.Car, error) {
	car := &models.Car{}

	res := r.db.Model(car).Where("id = ?", carId).Preload("Type").First(&car)

	if res.Error != nil {
		return nil, res.Error
	}

	return car, nil
}

func (r *CarRepository) CreateCar(ctx context.Context, formData *models.FormCar, userId uuid.UUID) error {
	cars := &models.Car{
		Name: formData.Name,
		Slug: slug.Make(formData.Name),
		Unit: formData.Unit,
		Available: formData.Unit,
		Price: formData.Price,
		TypeId: formData.TypeId,
		Seats: formData.Seats,
		Rating: formData.Rating,
		UserId: userId,
		ImageURL: formData.Image,
	}

	tx := r.db.Begin()

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

	var currentCar models.Car
	if err := tx.First(&currentCar, "id = ?", carId).Error; err != nil {
		tx.Rollback()
		return err
	}

	if name, ok := updateData["name"].(string); ok && name != "" {
		updateData["slug"] = slug.Make(name)
	}

	if newImage, ok := updateData["image_url"].(string); ok && newImage != "" && currentCar.ImageURL != "" {
		oldImagePath := filepath.Join("assets/car", currentCar.ImageURL)
		if err := utils.DeleteFile(oldImagePath); err != nil {
			tx.Rollback()
			return err
		}
	}

	res := tx.Model(&models.Car{}).Where("id = ?", carId).Updates(updateData)

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
	if res := tx.Where("id = ?", carId).Delete(&models.Car{}); res.Error != nil {
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