// handlers/car_types_handler.go
package handlers

import (
	"context"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/policy"
	validators "github.com/DestaAri1/RentAuto/validatiors"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CarTypesRepository struct {
	BaseHandler
	Helper
	repository       models.CarTypesRepository
	carTypePolicy    *policy.CarTypesPolicy
	validatorManager *validators.ValidatorManager
}

// CheckPermission verifies user has permission to perform an action
func (h *CarTypesRepository) CheckPermission(ctx context.Context, roleId uuid.UUID, action string) error {
	var err error

	switch action {
	case "create":
		err = h.carTypePolicy.CanCreateCarTypes(ctx, roleId)
	case "update":
		err = h.carTypePolicy.CanUpdateCarTypes(ctx, roleId)
	case "delete":
		err = h.carTypePolicy.CanDeleteCarTypes(ctx, roleId)
	default:
		err = fiber.NewError(fiber.StatusForbidden, "Unknown permission action")
	}

	return err
}

func (h *CarTypesRepository) GetCarType(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	res, err := h.repository.GetCarType(context)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success get data", res)
}

func (h *CarTypesRepository) CreateCarType(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "create"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create car types")
	}

	userId, err := h.GetUserID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	formData := &models.FormCarTypes{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	// Use custom validator with unique validation
	if err := h.validatorManager.ValidateStruct(formData); err != nil {
		carValidator := validators.NewCarTypesValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	// Call repository method and check for error
	err = h.repository.CreateCarType(context, formData, userId)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Successfully create data", nil)
}

func (h *CarTypesRepository) UpdateCarType(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "update"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update car types")
	}

	userId, err := h.GetUserID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	carTypeId, err := h.ParseUUID(ctx.Params("carTypeId"))
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car type ID format")
	}

	updatedData := make(map[string]interface{})

	if err := ctx.BodyParser(&updatedData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	formData := &models.FormUpdateCarTypes{}
	if err := mapToStruct(updatedData, formData); err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid input format")
	}

	// For update validation, you might want to pass the current ID to exclude it from unique check
	// This would require modifying the unique validator to handle update scenarios
	if err := h.validatorManager.ValidateStruct(formData); err != nil {
		carValidator := validators.NewCarTypesValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	// Call repository method and check for error
	err = h.repository.UpdateCarType(context, updatedData, carTypeId, userId)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car type updated successfully!", nil)
}

func (h *CarTypesRepository) DeleteCarType(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "delete"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to delete car types")
	}

	carTypeId, err := h.ParseUUID(ctx.Params("carTypeId"))
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	err = h.repository.DeleteCarType(context, carTypeId)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Data successfully deleted", nil)
}

func NewCarTypesHandler(router fiber.Router, repository models.CarTypesRepository, roleRepo models.RoleRepository, validatorManager *validators.ValidatorManager) {
	basePolicy := policy.NewPolicy(roleRepo)
	carTypesPolicy := &policy.CarTypesPolicy{
		Policy: basePolicy,
	}

	handler := &CarTypesRepository{
		repository:       repository,
		carTypePolicy:    carTypesPolicy,
		validatorManager: validatorManager,
	}

	router.Get("/", handler.GetCarType)
	router.Post("/", handler.CreateCarType)
	router.Patch("/:carTypeId", handler.UpdateCarType)
	router.Delete("/:carTypeId", handler.DeleteCarType)
}