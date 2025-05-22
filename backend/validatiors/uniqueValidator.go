// validators/unique_validator.go
package validators

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

// UniqueValidator handles unique field validation
type UniqueValidator struct {
	db *gorm.DB
}

// NewUniqueValidator creates a new unique validator instance
func NewUniqueValidator(db *gorm.DB) *UniqueValidator {
	return &UniqueValidator{db: db}
}

// RegisterUniqueValidation registers the unique validation tag with the validator
func (uv *UniqueValidator) RegisterUniqueValidation(v *validator.Validate) {
	v.RegisterValidation("unique", uv.validateUnique)
}

// validateUnique validates if a field value is unique in the database
func (uv *UniqueValidator) validateUnique(fl validator.FieldLevel) bool {
	// Get the validation parameter (table.column format)
	param := fl.Param()
	if param == "" {
		return false
	}

	// Parse table and column from parameter
	parts := strings.Split(param, ".")
	if len(parts) != 2 {
		return false
	}

	table := parts[0]
	column := parts[1]
	value := fl.Field().String()

	// Check if value is empty (let required validation handle this)
	if value == "" {
		return true
	}

	// Check uniqueness in database
	var count int64
	result := uv.db.Table(table).Where(fmt.Sprintf("%s = ? AND deleted_at IS NULL", column), value).Count(&count)
	
	if result.Error != nil {
		return false
	}

	return count == 0
}

// validateUniqueForUpdate validates uniqueness for update operations (excluding current record)
func (uv *UniqueValidator) validateUniqueForUpdate(fl validator.FieldLevel) bool {
	param := fl.Param()
	if param == "" {
		return false
	}

	parts := strings.Split(param, ".")
	if len(parts) < 2 {
		return false
	}

	table := parts[0]
	column := parts[1]
	value := fl.Field().String()

	if value == "" {
		return true
	}

	var count int64
	query := uv.db.Table(table).Where(fmt.Sprintf("%s = ? AND deleted_at IS NULL", column), value)
	
	// If there's a third parameter, it should be the ID to exclude
	if len(parts) == 3 {
		excludeId := parts[2]
		query = query.Where("id != ?", excludeId)
	}

	result := query.Count(&count)
	
	if result.Error != nil {
		return false
	}

	return count == 0
}