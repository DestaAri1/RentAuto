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

type CarHandler struct {
	BaseHandler
	repository models.CarRepository
	carPolicy  *policy.CarPolicy
}

func (h *CarHandler) GetCars(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
    defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carPolicy.CanViewCars(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view cars")
	}

	res, err := h.repository.GetCars(context)
    if err != nil {
        return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
    }

    return h.handlerSuccess(ctx, fiber.StatusOK, "Cars Data", res)
}

func (h *CarHandler) CreateCar(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
    defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carPolicy.CanCreateCar(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create cars")
	}

	formData := &models.FormCar{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}
	
	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewCarValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	car := h.repository.CreateCar(context, formData).Error()
	if car != "" {
		return h.handlerError(ctx, fiber.StatusBadRequest, car)
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car Created!", nil)
}

func (h *CarHandler) UpdateCar(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second)) 
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carPolicy.CanUpdateCar(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update cars")
	}

	carIdParam := ctx.Params("carId")
	carId, err := uuid.Parse(carIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	updatedData := make(map[string]interface{})

	if err := ctx.BodyParser(&updatedData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	formData := &models.FormCar{}
	if err := mapToStruct(updatedData, formData); err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid input format")
	}

	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewCarValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	car := h.repository.UpdateCar(context, updatedData, carId).Error()
	if car != "" {
		return h.handlerError(ctx, fiber.StatusBadGateway, car)
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car update successfully!", nil)
}

func (h *CarHandler) DeleteCar(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second)) 
	defer cancel()

	// Get role ID from context (assuming it's set by middleware)
	roleId, ok := ctx.Locals("roleId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "Role ID not found in context")
	}

	if err := h.carPolicy.CanDeleteCar(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to delete cars")
	}

	carIdParam := ctx.Params("carId")
	carId, err := uuid.Parse(carIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	car := h.repository.DeleteCar(context, carId).Error()
	if car != "" {
		return h.handlerError(ctx, fiber.StatusBadGateway, car)
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car delete successfully!", nil)
}

func NewCarHandler(router fiber.Router, repository models.CarRepository, roleRepo models.RoleRepository) {
	basePolicy := policy.NewPolicy(roleRepo)
	carPolicy := &policy.CarPolicy{
		Policy: basePolicy,
	}
	
	handler := &CarHandler{
		repository: repository,
		carPolicy:  carPolicy,
	}

	router.Get("/", handler.GetCars)
	router.Post("/", handler.CreateCar)
	router.Patch("/:carId", handler.UpdateCar)
	router.Delete("/:carId", handler.DeleteCar)
}