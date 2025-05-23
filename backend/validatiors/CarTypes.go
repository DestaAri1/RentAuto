package validators

import (
	"fmt"
	"strings"

	"github.com/DestaAri1/RentAuto/utils"
)

// CarTypesValidator mengimplementasikan ValidationErrorHandler untuk form car type
type CarTypesValidator struct{}

// NewCarTypesValidator membuat instance baru dari CarTypesValidator
func NewCarTypesValidator() utils.ValidationErrorHandler {
	return &CarTypesValidator{}
}

// HandleFieldError mengimplementasikan ValidationErrorHandler interface
func (v *CarTypesValidator) HandleFieldError(field string, tag string, param string) string {
	switch field {
	case "Name":
		return v.handleNameValidation(tag, param)
	default:
		return ""
	}
}

func (v *CarTypesValidator) handleNameValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Name field is required"
	case "unique":
		// Extract table.column from param for better error message
		parts := strings.Split(param, ".")
		if len(parts) >= 2 {
			return fmt.Sprintf("Name already exists in database")
		}
		return "Name must be unique"
	default:
		return ""
	}
}