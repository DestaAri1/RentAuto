package repository

import (
	"context"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarTypesRepository struct {
	db *gorm.DB
}

func (r *CarTypesRepository) GetCarType(ctx context.Context) ([]*models.CarTypeResponses, error) {
	carTypes := []*models.CarTypeResponses{}

	res := r.db.
		Table("car_types c").
		Select("c.id, c.name").
		Where("deleted_at IS NULL").
		Scan(&carTypes)

	if res.Error != nil {
		return nil, res.Error
	}

	// Return the found car types instead of nil, nil
	return carTypes, nil
}

func (r *CarTypesRepository) CreateCarType(ctx context.Context, formData *models.FormCarTypes, userId uuid.UUID) error {
	carType := &models.CarTypes{
		Name:   formData.Name,
		UserId: userId,
	}

	tx := r.db.Begin()

	if res := tx.Create(&carType); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()

	return nil
}

func (r *CarTypesRepository) UpdateCarType(ctx context.Context, updateData map[string]interface{}, carTypeId uuid.UUID, userId uuid.UUID) error {
	tx := r.db.Begin()

	if res := tx.Model(&models.CarTypes{}).Where("id = ? AND deleted_at IS NULL", carTypeId).Updates(updateData); res.Error != nil {
		tx.Rollback()
		return res.Error
	}

	tx.Commit()
	return nil
}

func (r *CarTypesRepository) DeleteCarType(ctx context.Context, carTypeId uuid.UUID) error {
	tx := r.db.Begin()
	
	// Soft delete menggunakan gorm
	if res := tx.Where("id = ?", carTypeId).Delete(&models.CarTypes{}); res.Error != nil {
		tx.Rollback()
		return res.Error
	}
	
	tx.Commit()
	return nil
}

func NewCarTypeRepositories(db *gorm.DB) models.CarTypesRepository {
	return &CarTypesRepository{
		db: db,
	}
}