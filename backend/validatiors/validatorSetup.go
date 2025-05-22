// validators/validator_setup.go
package validators

import (
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

// ValidatorManager manages all custom validators
type ValidatorManager struct {
	validator       *validator.Validate
	uniqueValidator *UniqueValidator
}

// NewValidatorManager creates a new validator manager with custom validations
func NewValidatorManager(db *gorm.DB) *ValidatorManager {
	v := validator.New()
	uniqueValidator := NewUniqueValidator(db)
	
	// Register custom validations
	uniqueValidator.RegisterUniqueValidation(v)
	
	return &ValidatorManager{
		validator:       v,
		uniqueValidator: uniqueValidator,
	}
}

// GetValidator returns the configured validator instance
func (vm *ValidatorManager) GetValidator() *validator.Validate {
	return vm.validator
}

// ValidateStruct validates a struct with all registered custom validations
func (vm *ValidatorManager) ValidateStruct(s interface{}) error {
	return vm.validator.Struct(s)
}