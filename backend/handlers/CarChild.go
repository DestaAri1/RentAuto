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
	"github.com/gosimple/slug"
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

func (h *CarChildHandler) GetOneCarChild(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 *time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "getOne"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view cars")
	}

	carChildId := ctx.Params("carChildSlug")
	
	result, err := h.repository.GetOneCarChild(context, carChildId)

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
	parentId, err := h.ParseFormValue(ctx, "car_parent", "uuid")

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	formData.CarParentId = parentId.(uuid.UUID)

	// Handle file upload - check if file exists first
	file, err := h.ParseFormValue(ctx, "image", "file", "assets/car")
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	formData.Image = file.(string)

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

func (h *CarChildHandler) UpdateStatusCarChild(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "update"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update car")
	}

	userId, err := h.GetUserID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	carChildId, err := h.ParseUUID(ctx.Params("carChildId"))
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	formData := &models.StatusForm{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	// Validate form data
	if err := validator.New().Struct(formData); err != nil {
		validator := validators.NewCarChildValidator()
		return h.handleValidationError(ctx, err, &validator)
	}

	updatedData := make(map[string]interface{})

	if formData.Status != nil {
		updatedData["status"] = formData.Status
	}

	// Check if we have any data to update
	if len(updatedData) == 0 {
		return h.handlerError(ctx, fiber.StatusBadRequest, "No data provided for update")
	}

	// Update car child in repository
	err = h.repository.UpdateStatusCarChild(context, updatedData, userId, carChildId)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car Child updated successfully!", nil)
}

func (h *CarChildHandler) UpdateCarChild(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "update"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update car")
	}

	userId, err := h.GetUserID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	carChildId, err := h.ParseUUID(ctx.Params("carChildId"))
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	formData := &models.FormUpdateCarChild{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	parentId, err := h.ParseFormValue(ctx, "car_parent", "uuid")
	if  err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	formData.CarParentId = parentId.(uuid.UUID)

	// Handle file upload if provided
	file, err := ctx.FormFile("image")
	if err == nil {
		// File was provided, validate and process it
		contentType := file.Header.Get("Content-Type")
		if !strings.Contains(utils.AllowedMimeTypes, contentType) {
			return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid file type. Allowed types: jpg, jpeg, png")
		}

		if file.Size > utils.MaxFileSize {
			return h.handlerError(ctx, fiber.StatusBadRequest, "File size exceeds maximum limit of 5MB")
		}

		// Save new uploaded file
		filename, err := utils.SaveUploadedFile(file, "assets/car")
		if err != nil {
			return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
		}
		
		formData.Image = filename
	}

	// Validate form data
	if err := validator.New().Struct(formData); err != nil {
		// Clean up uploaded file if validation fails
		if formData.Image != "" {
			utils.DeleteFile(filepath.Join("assets/car", formData.Image))
		}
		validator := validators.NewCarChildValidator()
		return h.handleValidationError(ctx, err, &validator)
	}

	updatedData := make(map[string]interface{})

	// Only update fields that are provided
	if formData.Name != "" {
		updatedData["name"] = formData.Name
		updatedData["slug"] = slug.Make(formData.Name)
	}
	if formData.Alias != "" {
		updatedData["alias"] = formData.Alias
	}
	if formData.Status != nil {
		updatedData["status"] = formData.Status
	}
	if formData.Color != "" {
		updatedData["color"] = formData.Color
	}
	if formData.Description != "" {
		updatedData["description"] = formData.Description
	}
	if formData.CarParentId != uuid.Nil {
		updatedData["car_parent_id"] = formData.CarParentId
	}
	if formData.Image != "" {
		updatedData["image_url"] = formData.Image
	}

	// Check if we have any data to update
	if len(updatedData) == 0 {
		return h.handlerError(ctx, fiber.StatusBadRequest, "No data provided for update")
	}

	// Update car child in repository
	err = h.repository.UpdateCarChild(context, updatedData, userId, carChildId)
	if err != nil {
		// Clean up uploaded file if update fails
		if filename, ok := updatedData["image_url"].(string); ok {
			utils.DeleteFile(filepath.Join("assets/car", filename))
		}
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Car Child updated successfully!", nil)
}

func (h *CarChildHandler) DeleteCar(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 *time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.CheckPermission(context, roleId, "delete"); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to update car")
	}

	carChildId, err := h.ParseUUID(ctx.Params("carChildId"))
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	res := h.repository.DeleteCarChild(context, carChildId)
	if res != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success delete", "")
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
	router.Get("/view/:carChildSlug", handler.GetOneCarChild)
	router.Post("/", handler.CreateCarChild)
	router.Patch("/update-status/:carChildId", handler.UpdateStatusCarChild)
	router.Patch("/:carChildId", handler.UpdateCarChild)
	router.Delete("/:carChildId", handler.DeleteCar)
}