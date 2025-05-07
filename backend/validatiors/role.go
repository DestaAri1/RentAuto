package validators

import "github.com/DestaAri1/RentAuto/utils"

// RoleValidator mengimplementasikan ValidationErrorHandler untuk form role
type RoleValidator struct{}

// NewRoleValidator membuat instance baru dari RoleValidator
func NewRoleValidator() utils.ValidationErrorHandler {
	return &RoleValidator{}
}

// HandleFieldError mengimplementasikan ValidationErrorHandler interface
func (v *RoleValidator) HandleFieldError(field string, tag string, param string) string {
	switch field {
	case "Name":
		return v.handleNameValidation(tag, param)
	case "Permission":
		return v.handlePermissionValidation(tag, param)
	default:
		return ""
	}
}

func (v *RoleValidator) handleNameValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Name field is required"
	case "min":
		return "Minimum 3 characters"
	case "max":
		return "Maximum 100 characters"
	default:
		return ""
	}
}

func (v *RoleValidator) handlePermissionValidation(tag string, param string) string {
	switch tag {
	case "required":
		return "Permission field is required and cannot be empty"
	case "dive":
		return "Permission must be a valid array"
	default:
		return ""
	}
}