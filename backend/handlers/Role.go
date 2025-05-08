package handlers

import (
	"context"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/policy"
	validators "github.com/DestaAri1/RentAuto/validatiors"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type RoleRepository struct {
	BaseHandler
	repository models.RoleRepository
	policy *policy.AdminPolicy
}

func (h *RoleRepository) GetRoles(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5 *time.Second))
	defer cancel()

	data, err := h.repository.GetRoles(context)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success", data)
}

func (h *RoleRepository) CreateRole(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5 *time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.policy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create cars")
	}

	formData := &models.FormRole{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewRoleValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	// Fixed: Call repository method and check for error
	err := h.repository.CreateRole(context, formData)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Successfully create data", nil)
}

func (h *RoleRepository) UpdateRole(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5 *time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	roleIdParam := ctx.Params("roleId")
	roleIdFix, err := uuid.Parse(roleIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	if err := h.policy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create cars")
	}

	formData := &models.FormRole{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewRoleValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	// Fixed: Call repository method and check for error
	err = h.repository.UpdateRole(context, formData, roleIdFix)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Successfully create data", nil)
}

func (h *RoleRepository) DeleteRole(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5 *time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.policy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create cars")
	}

	roleIdParam := ctx.Params("roleId")
	roleIdFix, err := uuid.Parse(roleIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	if err := h.repository.DeleteRole(context, roleIdFix); err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "success", nil)
}

func NewRoleHandler(router fiber.Router, repository models.RoleRepository) {
	handler := &RoleRepository{
		repository: repository,
	}

	router.Get("/", handler.GetRoles)
	router.Post("/", handler.CreateRole)
	router.Patch("/:roleId", handler.UpdateRole)
	router.Delete("/:roleId", handler.DeleteRole)
}