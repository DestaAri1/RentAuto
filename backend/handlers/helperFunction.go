package handlers

import (
	"context"
	"time"

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