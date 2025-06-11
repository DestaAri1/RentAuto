package validators

import "github.com/DestaAri1/RentAuto/utils"

type UserValidator struct{}

func NewUserValidator() utils.ValidationErrorHandler {
	return &UserValidator{}
}

func (v *UserValidator) HandleFieldError(field string, tag string, param string) string {
	switch field {
	case "Name":
		return v.handleNameValidation(tag, param)
	case "Email":
		return v.handleEmailValidation(tag, param)
	case "Password":
		return v.handlePasswordValidation(tag, param)
	case "Role":
		return v.handleRoleValidation(tag, param)
	default:
		return ""
	}
}

func (v *UserValidator) handleNameValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Name is required"
	default :
		return ""
	}
}
func (v *UserValidator) handleEmailValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Email is required"
	case "email" :
		return "Use email format"
	default :
		return ""
	}
}
func (v *UserValidator) handlePasswordValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Password is required"
	default :
		return ""
	}
}
func (v *UserValidator) handleRoleValidation(tag string, param string) string {
	switch tag {
	case "required" :
		return "Role is required"
	case "uuid" :
		return "Parent must be a valid UUID"
	default :
		return ""
	}
}