package repository

import (
	"context"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
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

func (r *CarRepository) CreateCar(ctx context.Context, formData *models.FormCar) error {
	cars := &models.Car{
		Name: formData.Name,
		Unit: formData.Unit,
		Available: formData.Unit,
		Price: formData.Price,
		TypeId: formData.TypeId,
		Seats: formData.Seats,
		Rating: formData.Rating,
	}

	tx := r.db.Begin()

	if res := tx.Create(cars); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()
	return nil
}

func (r *CarRepository) UpdateCar(ctx context.Context, updateData map[string]interface{}, carId uuid.UUID) error {
	// cars := &models.Car{
	// 	Name: formData.Name,
	// 	Price: formData.Price,
	// 	TypeId: formData.TypeId,
	// 	Seats: formData.Seats,
	// 	Rating: formData.Rating,
	// }

	tx := r.db.Begin()

	if res := tx.Model(&models.Car{}).Where("id = ?", carId).Updates(updateData); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()
	return nil
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