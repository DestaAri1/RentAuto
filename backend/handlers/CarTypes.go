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

type CarTypesRepository struct {
	BaseHandler
	repository    models.CarTypesRepository
	carTypePolicy *policy.CarTypesPolicy
}

func (h *CarTypesRepository) GetCarType(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	res, err := h.repository.GetCarType(context)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success get data", res)
}

func (h *CarTypesRepository) CreateCarType(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carTypePolicy.CanCreateCarTypes(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create cars")
	}

	userId := ctx.Locals("userId").(uuid.UUID)

	formData := &models.FormCarTypes{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}
	
	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewCarTypesValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	// Fixed: Call repository method and check for error
	err := h.repository.CreateCarType(context, formData, userId)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Successfully create data", nil)
}

func (h *CarTypesRepository) UpdateCarType(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second)) 
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carTypePolicy.CanUpdateCarTypes(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update cars")
	}

	userId := ctx.Locals("userId").(uuid.UUID)

	carTypeIdParam := ctx.Params("carTypeId")
	carTypeId, err := uuid.Parse(carTypeIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	updatedData := make(map[string]interface{})

	if err := ctx.BodyParser(&updatedData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	formData := &models.FormCarTypes{}
	if err := mapToStruct(updatedData, formData); err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid input format")
	}

	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewCarTypesValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	// Fixed: Call repository method and check for error
	err = h.repository.UpdateCarType(context, updatedData, carTypeId, userId)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car update successfully!", nil)
}

func (h *CarTypesRepository) DeleteCarType(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second)) 
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carTypePolicy.CanDeleteCarTypes(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update cars")
	}

	carTypeIdParam := ctx.Params("carTypeId")
	carTypeId, err := uuid.Parse(carTypeIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	res := h.repository.DeleteCarType(context, carTypeId)

	if res != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Data successfully deleted", nil)
}

func NewCarTypesHandler(router fiber.Router, repository models.CarTypesRepository, roleRepo models.RoleRepository) {
	basePolicy := policy.NewPolicy(roleRepo)
	carTypesPolicy := &policy.CarTypesPolicy{
		Policy: basePolicy,
	}

	handler := &CarTypesRepository{
		repository:    repository,
		carTypePolicy: carTypesPolicy,
	}

	router.Get("/", handler.GetCarType)
	router.Post("/", handler.CreateCarType)
	router.Patch("/:carTypeId", handler.UpdateCarType)
	router.Delete("/:carTypeId", handler.DeleteCarType)
}