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
	repository  models.RoleRepository
	adminPolicy *policy.AdminPolicy  // Perbaiki nama field
}

func (h *RoleRepository) GetRoles(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	// Check permission untuk melihat roles (hanya admin)
	if err := h.adminPolicy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view roles")
	}

	data, err := h.repository.GetRoles(context)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success", data)
}

func (h *RoleRepository) CreateRole(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	// Check permission untuk manage roles (hanya admin)
	if err := h.adminPolicy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create roles")
	}

	formData := &models.FormRole{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := validator.New().Struct(formData); err != nil {
		roleValidator := validators.NewRoleValidator()  // Perbaiki nama validator
		return h.handleValidationError(ctx, err, &roleValidator)
	}

	// Call repository method and check for error
	err := h.repository.CreateRole(context, formData)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusCreated, "Successfully created role", nil)
}

func (h *RoleRepository) UpdateRole(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	// Check permission untuk manage roles (hanya admin)
	if err := h.adminPolicy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update roles")
	}

	// Parse role ID from params
	roleIdParam := ctx.Params("roleId")
	roleIdToUpdate, err := uuid.Parse(roleIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid role ID format")
	}

	formData := &models.FormRole{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := validator.New().Struct(formData); err != nil {
		roleValidator := validators.NewRoleValidator()
		return h.handleValidationError(ctx, err, &roleValidator)
	}

	// Call repository method and check for error
	err = h.repository.UpdateRole(context, formData, roleIdToUpdate)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Successfully updated role", nil)
}

func (h *RoleRepository) DeleteRole(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	// Check permission untuk manage roles (hanya admin)
	if err := h.adminPolicy.CanManageRoles(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to delete roles")
	}

	// Parse role ID from params
	roleIdParam := ctx.Params("roleId")
	roleIdToDelete, err := uuid.Parse(roleIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid role ID format")
	}

	if err := h.repository.DeleteRole(context, roleIdToDelete); err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Successfully deleted role", nil)
}

// Constructor yang diperbaiki
func NewRoleHandler(router fiber.Router, repository models.RoleRepository, adminPolicy *policy.AdminPolicy) {
	handler := &RoleRepository{
		repository:  repository,
		adminPolicy: adminPolicy,  // Inject AdminPolicy
	}

	router.Get("/", handler.GetRoles)
	router.Post("/", handler.CreateRole)
	router.Patch("/:roleId", handler.UpdateRole)
	router.Delete("/:roleId", handler.DeleteRole)
}