package handlers

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/DestaAri1/RentAuto/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Helper struct {}

func (hp *Helper) WithTimeout(duration time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), duration)
}

// GetUserID extracts the user ID from the context
func (hp *Helper) GetUserID(ctx *fiber.Ctx) (uuid.UUID, error) {
	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return uuid.Nil, fiber.NewError(fiber.StatusUnauthorized, "User ID not found in context")
	}
	return userId, nil
}

// GetRoleID extracts the role ID from the context
func (hp *Helper) GetRoleID(ctx *fiber.Ctx) (uuid.UUID, error) {
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return uuid.Nil, fiber.NewError(fiber.StatusUnauthorized, "Role ID not found in context")
	}
	return roleId, nil
}

// ParseUUID parses a string parameter to UUID
func(hp *Helper) ParseUUID(param string) (uuid.UUID, error) {
	id, err := uuid.Parse(param)
	if err != nil {
		return uuid.Nil, fiber.NewError(fiber.StatusBadRequest, "Invalid UUID format")
	}
	return id, nil
}

func (hp *Helper) ParseFormValue(ctx *fiber.Ctx, fieldName string, fieldType string, destFolder ...string) (any, error) {
	value := ctx.FormValue(fieldName)

	switch fieldType {
	case "uuid":
		id,_ := uuid.Parse(value)
		return id, nil

	case "int":
		intVal,_ := strconv.Atoi(value)
		return intVal, nil

	case "string":
		return value, nil

	case "file":
		file, err := ctx.FormFile(fieldName)

		contentType := file.Header.Get("Content-Type")
		if !strings.Contains(utils.AllowedMimeTypes, contentType) {
			return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid file type for "+fieldName)
		}

		if file.Size > utils.MaxFileSize {
			return nil, fiber.NewError(fiber.StatusBadRequest, "File size exceeds 5MB for "+fieldName)
		}

		// Gunakan destFolder jika disediakan, atau default
		saveFolder := "assets"
		if len(destFolder) > 0 && destFolder[0] != "" {
			saveFolder = destFolder[0]
		}

		filename, err := utils.SaveUploadedFile(file, saveFolder)
		if err != nil {
			return nil, fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
		return filename, nil

	default:
		return nil, fiber.NewError(fiber.StatusBadRequest, "Unsupported field type for " + fieldName)
	}
}
