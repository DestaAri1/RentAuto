package handlers

import (
	"context"
	// "path/filepath"
	// "strings"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/policy"
	// "github.com/DestaAri1/RentAuto/utils"
	validators "github.com/DestaAri1/RentAuto/validatiors"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
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

	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "User ID not found in context")
	}

	if err := h.carPolicy.CanCreateCar(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create cars")
	}

	// Handle file upload after validation
	// file, err := ctx.FormFile("image")

	// Parse form data first
	formData := &models.FormCarParent{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	// Validate form data
	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewCarValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}


	// Validate file type and size before saving
	// contentType := file.Header.Get("Content-Type")
	// if !strings.Contains(utils.AllowedMimeTypes, contentType) {
	// 	return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid file type. Allowed types: jpg, jpeg, png")
	// }

	// if file.Size > utils.MaxFileSize {
	// 	return h.handlerError(ctx, fiber.StatusBadRequest, "File size exceeds maximum limit of 5MB")
	// }

	// // Save uploaded file
	// filename, err := utils.SaveUploadedFile(file, "assets/car")
	// if err != nil {
	// 	return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	// }

	// // Set the image filename
	// formData.Image = filename

	// Create car
	err := h.repository.CreateCar(context, formData, userId)
	if err != nil {
		// Clean up uploaded file if creation fails
		// utils.DeleteFile(filepath.Join("assets/car", filename))
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
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

	userId, ok := ctx.Locals("userId").(uuid.UUID)
	if !ok {
		return h.handlerError(ctx, fiber.StatusUnauthorized, "User ID not found in context")
	}

	if err := h.carPolicy.CanUpdateCar(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update cars")
	}

	carIdParam := ctx.Params("carId")
	carId, err := uuid.Parse(carIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid car ID format")
	}

	// Parse form data first
	formData := &models.FormCarParent{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	// Memeriksa apakah ada gambar yang diunggah
	// file, errs := ctx.FormFile("image")
	
	// Jika tidak ada file yang diunggah, berikan nilai default ke formData.Image
	// agar validasi tidak gagal, tetapi jangan update gambar di database
	// if errs != nil {
	// 	formData.Image = "default_placeholder.jpg" // Nilai default hanya untuk validasi
	// } else {
	// 	formData.Image = file.Filename
	// }

	// Validate form data
	if err := validator.New().Struct(formData); err != nil {
		carValidator := validators.NewCarValidator()
		return h.handleValidationError(ctx, err, &carValidator)
	}

	updatedData := make(map[string]interface{})

	// Handle file upload if provided
	// if err == nil {
	// 	// File diunggah, validasi dan simpan file
	// 	contentType := file.Header.Get("Content-Type")
	// 	if !strings.Contains(utils.AllowedMimeTypes, contentType) {
	// 		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid file type. Allowed types: jpg, jpeg, png")
	// 	}

	// 	if file.Size > utils.MaxFileSize {
	// 		return h.handlerError(ctx, fiber.StatusBadRequest, "File size exceeds maximum limit of 5MB")
	// 	}

	// 	// Save new uploaded file
	// 	filename, err := utils.SaveUploadedFile(file, "assets/car")
	// 	if err != nil {
	// 		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	// 	}
		
	// 	// Hanya update image_url di database jika benar-benar ada file baru
	// 	updatedData["image_url"] = filename
	// }

	// Convert form data to map for update
	if formData.Name != "" {
		updatedData["name"] = formData.Name
		updatedData["slug"] = slug.Make(formData.Name)
	}
	if formData.Price != 0 {
		updatedData["price"] = formData.Price
	}
	if formData.TypeId != uuid.Nil {
		updatedData["type_id"] = formData.TypeId
	}
	if formData.Seats != 0 {
		updatedData["seats"] = formData.Seats
	}

	if len(updatedData) == 0 {
		return h.handlerError(ctx, fiber.StatusBadRequest, "No data provided for update")
	}

	// Update car
	err = h.repository.UpdateCar(context, updatedData, carId, userId)
	if err != nil {
		// Clean up uploaded file if update fails
		// if filename, ok := updatedData["image_url"].(string); ok {
		// 	utils.DeleteFile(filepath.Join("assets/car", filename))
		// }
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car updated successfully!", nil)
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

	car := h.repository.DeleteCar(context, carId)
	if car != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, car.Error())
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