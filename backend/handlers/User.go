package handlers

import (
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/policy"
	validators "github.com/DestaAri1/RentAuto/validatiors"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type UserHandler struct {
	BaseHandler
	repository models.UserRepository
	adminPolicy *policy.AdminPolicy
	Helper
}

func (h *UserHandler) GetAllUser(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.adminPolicy.CanManageUsers(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view roles")
	}

	users, err := h.repository.GetAllUser(context)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadGateway, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success", users)
}

func (h *UserHandler) CreateUser(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	if err := h.adminPolicy.CanManageUsers(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view roles")
	}

	formData := &models.CreateUserForm{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := validator.New().Struct(formData); err != nil {
		userValidator := validators.NewUserValidator()
		return h.handleValidationError(ctx, err, &userValidator)
	}

	res := h.repository.CreateUser(context, formData)
	if res != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success create a user", nil)
}

func (h *UserHandler) UpdateUser(ctx *fiber.Ctx) error {
	context, cancel := h.WithTimeout(5 * time.Second)
	defer cancel()

	
	roleId, err := h.GetRoleID(ctx)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusUnauthorized, err.Error())
	}

	userIdParam := ctx.Params("userId")
	userId, err := uuid.Parse(userIdParam)
	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, "Invalid role ID format")
	}
	
	if err := h.adminPolicy.CanManageUsers(context, roleId); err != nil {
		return h.handlerError(ctx, fiber.StatusForbidden, "You don't have permission to view roles")
	}

	formData := &models.UpdateUserForm{}
	if err := ctx.BodyParser(formData); err != nil {
		return h.handlerError(ctx, fiber.StatusUnprocessableEntity, err.Error())
	}

	if err := validator.New().Struct(formData); err != nil {
		userValidator := validators.NewUserValidator()
		return h.handleValidationError(ctx, err, &userValidator)
	}

	updateData := make(map[string]interface{})

	if formData.Name != "" {
		updateData["name"] = formData.Name
	}

	if formData.Email != "" {
		updateData["email"] = formData.Email
	}

	if formData.Password != "" {
		updateData["password"] = formData.Password
	}

	if formData.Role != uuid.Nil{
		updateData["role_id"] = formData.Role
	}

	err = h.repository.UpdateUser(context, updateData, userId)

	if err != nil {
		return h.handlerError(ctx, fiber.StatusBadRequest, err.Error())
	}

	return h.handlerSuccess(ctx, fiber.StatusOK, "Success update user!", nil)
}

func NewUserHandler(router fiber.Router, repository models.UserRepository, policy *policy.AdminPolicy) {
	handler := &UserHandler{
		repository: repository,
		adminPolicy: policy,
	}

	router.Get("/", handler.GetAllUser)
	router.Post("/", handler.CreateUser)
	router.Patch("/:userId", handler.UpdateUser)
}