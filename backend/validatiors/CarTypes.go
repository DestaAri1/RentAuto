package validators

import "github.com/DestaAri1/RentAuto/utils"

// CarValidator mengimplementasikan ValidationErrorHandler untuk form car
type CarTypesValidator struct{}

// NewCarValidator membuat instance baru dari CarValidator
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
	default:
		return ""
	}
}
