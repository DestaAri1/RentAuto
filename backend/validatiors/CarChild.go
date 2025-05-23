package validators

import "github.com/DestaAri1/RentAuto/utils"

type CarChildValidator struct{}

func NewCarChildValidator() utils.ValidationErrorHandler {
	return &CarChildValidator{}
}

func(v *CarChildValidator) HandleFieldError(field string, tag string, param string) string {
	switch field {
	case "Name" :
		return v.handleNameValidation(tag, param)
	case "Alias":
		return v.handleAliasValidation(tag, param)
	case "Status" :
		return v.handleStatusValidation(tag, param)
	case "Color" :
		return v.handleColorValidation(tag, param)
	case "Seats" :
		return v.handleSeatsValidation(tag, param)
	case "Image" :
		return v.handleImageValidation(tag, param)
	case "Description" :
		return v.handleDescriptionValidation(tag, param)
	case "CarParentId" :
		return v.handleCarParentIdValidation(tag, param)
	default:
		return ""
	}
}

func (v *CarChildValidator) handleNameValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Name is required"
	case "max" :
		return "Maximum 100 characters"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleAliasValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Alias is required"
	case "max" :
		return "Maximum 100 characters"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleStatusValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Status is required"
	case "min" :
		return "Minimum 0"
	case "max" :
		return "Maximum 5"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleSeatsValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Seat is required"
	case "min" :
		return "Minimum 0"
	case "max" :
		return "Maximum 14"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleColorValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Color is required"
	case "max" :
		return "Maximum 15 characters"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleImageValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Image is required"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleDescriptionValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Description is required"
	default :
		return ""
	}
}

func (v *CarChildValidator) handleCarParentIdValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Parent is required"
	case "uuid" :
		return "Parent must be a valid UUID"
	default :
		return ""
	}
}
