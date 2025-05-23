package handlers

import (
	"context"
	"path/filepath"
	"strings"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/policy"
	"github.com/DestaAri1/RentAuto/utils"
	validators "github.com/DestaAri1/RentAuto/validatiors"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type CarChildHandler struct {
	BaseHandler
	Helper
	repository models.CarChildRepository
	carChildPolicy    *policy.CarPolicy
	validatorManager *validators.ValidatorManager
}

func (h *CarChildHandler) CheckPermission(ctx context.Context, roleId uuid.UUID, action string) error {
	var err error

	switch action {
	case "getAll" :
		err = h.carChildPolicy.CanViewCars(ctx, roleId)
	case "getOne" :
		err = h.carChildPolicy.CanEditCar(ctx, roleId)
	case "create" :
		err = h.carChildPolicy.CanCreateCar(ctx, roleId)
	case "update" :
		err = h.carChildPolicy.CanUpdateCar(ctx, roleId)
	case "delete" :
		err = h.carChildPolicy.CanDeleteCar(ctx, roleId)
	}

	return err
}

func (h *CarChildHandler) GetCarChild(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 *time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "getAll"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view cars")
	}

	slugStr := ctx.Params("carSlug")
	
	result, err := h.repository.GetCarChilds(context, slugStr)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "", result)
}

func (h *CarChildHandler) CreateCarChild(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "create"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to create car")
	}

	userId, err := h.GetUserID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	// Parse form data
	formData := &models.FormCarChild{Image: "default.png"}
	
	// Parse multipart form
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	// Parse parent ID
	if parentStr := ctx.FormValue("car_parent"); parentStr != "" {
		if parentId, err := uuid.Parse(parentStr); err == nil {
			formData.CarParentId = parentId
		} else {
			return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid parent ID format")
		}
	} else {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Parent ID is required")
	}

	// Handle file upload - check if file exists first
	file, err := ctx.FormFile("image")
	if err == nil && file != nil {
		// File exists, validate and process it
		contentType := file.Header.Get("Content-Type")
		if !strings.Contains(utils.AllowedMimeTypes, contentType) {
			return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid file type. Allowed types: jpg, jpeg, png")
		}

		if file.Size > utils.MaxFileSize {
			return h.handlerError(ctx, fiber.StatusBadRequest, "File size exceeds maximum limit of 5MB")
		}

		// Save uploaded file
		filename, err := utils.SaveUploadedFile(file, "assets/car")
		if err != nil {
			return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
		}

		// Set the image filename
		formData.Image = filename
	}

	// Validate form data
	if err := validator.New().Struct(formData); err != nil {
		// Clean up uploaded file if validation fails
		if formData.Image != "default.png" {
			utils.DeleteFile(filepath.Join("assets/car", formData.Image))
		}
		validator := validators.NewCarChildValidator()
		return h.handleValidationError(ctx, err, &validator)
	}

	// Create car child in repository
	err = h.repository.CreateCarChild(context, formData, userId)
	if err != nil {
		// Clean up uploaded file if creation fails
		if formData.Image != "default.png" {
			utils.DeleteFile(filepath.Join("assets/car", formData.Image))
		}
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusCreated, "Car Child Created Successfully!", nil)
}

func NewCarChildHandler(router fiber.Router, repository models.CarChildRepository, roleRepo models.RoleRepository) {
	basePolicy := policy.NewPolicy(roleRepo)
	carPolicy := &policy.CarPolicy{
		Policy: basePolicy,
	}
	
	handler := &CarChildHandler{
		repository: repository,
		carChildPolicy:  carPolicy,
	}

	router.Get("/:carSlug", handler.GetCarChild)
	router.Post("/", handler.CreateCarChild)
}