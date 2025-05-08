package validators

import "github.com/DestaAri1/RentAuto/utils"

// CarValidator mengimplementasikan ValidationErrorHandler untuk form car
type CarValidator struct{}

// NewCarValidator membuat instance baru dari CarValidator
func NewCarValidator() utils.ValidationErrorHandler {
	return &CarValidator{}
}

// HandleFieldError mengimplementasikan ValidationErrorHandler interface
func (v *CarValidator) HandleFieldError(field string, tag string, param string) string {
	switch field {
	case "Name":
		return v.handleNameValidation(tag, param)
	case "Unit":
		return v.handleUnitValidation(tag, param)
	case "Price":
		return v.handlePriceValidation(tag, param)
	case "TypeId":
		return v.handleTypeIdValidation(tag, param)
	case "Seats":
		return v.handleSeatsValidation(tag, param)
	case "Rating":
		return v.handleRatingValidation(tag, param)
	default:
		return ""
	}
}

func (v *CarValidator) handleNameValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Name field is required"
	case "max":
		return "Name cannot exceed 100 characters"
	default:
		return ""
	}
}

func (v *CarValidator) handleUnitValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Seats field is required"
	case "min":
		return "Seats must be at least 1"
	default:
		return ""
	}
}

func (v *CarValidator) handlePriceValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Price field is required"
	case "gt":
		return "Price must be greater than 0"
	default:
		return ""
	}
}

func (v *CarValidator) handleTypeIdValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Type ID is required"
	case "uuid":
		return "Type ID must be a valid UUID"
	default:
		return ""
	}
}

func (v *CarValidator) handleSeatsValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Seats field is required"
	case "min":
		return "Seats must be at least 1"
	case "max":
		return "Seats cannot exceed 100"
	default:
		return ""
	}
}

func (v *CarValidator) handleRatingValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Rating field is required"
	case "min":
		return "Rating must be at least 1"
	case "max":
		return "Rating cannot exceed 5"
	default:
		return ""
	}
}