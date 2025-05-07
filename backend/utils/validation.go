package utils

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func HandlerError(ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(fiber.Map{
		"status":  "fail",
		"message": message,
	})
}

// HandlerSuccess mengembalikan response JSON sukses
func HandlerSuccess(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	return ctx.Status(status).JSON(fiber.Map{
		"status":  "success",
		"message": message,
		"data":    data,
	})
}

// ValidationErrorHandler adalah interface yang harus diimplementasikan oleh validator form
type ValidationErrorHandler interface {
	HandleFieldError(field string, tag string, param string) string
}

// HandleValidationError adalah fungsi generik untuk menangani error validasi
func HandleValidationError(ctx *fiber.Ctx, err error, handler ValidationErrorHandler) error {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		errorMessages := make(map[string]string)

		for _, err := range ve {
			field := err.Field()
			tag := err.Tag()
			param := err.Param()
			
			message := handler.HandleFieldError(field, tag, param)
			if message != "" {
				errorMessages[field] = message
			}
		}

		if len(errorMessages) > 0 {
			return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "fail",
				"message": "Validation error",
				"errors":  errorMessages,
			})
		}
	}
	return nil
}
