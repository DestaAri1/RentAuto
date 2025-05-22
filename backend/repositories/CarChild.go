package repository

import (
	"context"
	"errors"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CarChildRepository struct {
	db *gorm.DB
}

func (r *CarChildRepository) GetCarChilds(ctx context.Context, carParentId uuid.UUID) ([]*models.CarChild, error) {
	carChild := []*models.CarChild{}

	checkCarParent := r.db.Model(&models.CarParent{}).Where("id = ? and deleted_at IS NULL", carParentId).First(&models.CarParent{})

	if checkCarParent.RowsAffected == 0 {
		return nil, errors.New("Cannot find parent ID")
	}

	res := r.db.Model(&models.CarChild{}).Where("car_parent_id = ? AND deleted_at IS NULL", carParentId).Find(&carChild)

	if res.Error != nil {
		return nil, res.Error
	}
	return carChild, nil
}

func (r *CarChildRepository) GetOneCarChild(ctx context.Context, carChildId uuid.UUID) (*models.CarChild, error) {
	carChild := &models.CarChild{}

	checkCarChild := r.db.Model(carChild).Where("id = ?", carChildId).First(&carChild)
	if checkCarChild.RowsAffected == 0 {
		return nil, errors.New("Id not found")
	}

	if checkCarChild.Error != nil {
		return nil, checkCarChild.Error
	}
	
	return carChild, nil
}

func (r *CarChildRepository) CreateCarChild(ctx context.Context, formData *models.FormCarChild, userId uuid.UUID) error {
	return nil
}

func (r *CarChildRepository) UpdateCarChild(ctx context.Context, updateData map[string]interface{}, carChildId uuid.UUID, userId uuid.UUID ) error {
	return nil
}

func (r *CarChildRepository) DeleteCarChild(ctx context.Context, carChildId uuid.UUID) error {
	return nil
}

func NewCarChildRepository(db *gorm.DB) models.CarChildRepository {
	return &CarChildRepository{db: db}
}