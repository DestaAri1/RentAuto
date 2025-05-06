package handlers

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	service models.AuthServices
}

var validate = validator.New()

func (h *AuthHandler) handleError(ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status" : "fail",
		"message" : message,
	})
}

func (h *AuthHandler) handleSucces(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status" : "success",
		"message" : message,
		"data" : data,
	})
}

func (h *AuthHandler) handleValidation(ctx *fiber.Ctx, err error) error {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		for _, err := range ve {
			var message string
			switch err.Field() {
			case "Username" :
				switch err.Tag(){
				case "required":
					message = fmt.Errorf("username field is required").Error()		
				}
				return h.handleError(ctx, fiber.StatusBadRequest, message)
			case "Email" :
				switch err.Tag() {
				case "required":
					message = fmt.Errorf("email field is required").Error()		
				case "email" :
					message = fmt.Errorf("please use an email format").Error()
				}
				return h.handleError(ctx, fiber.StatusBadRequest, message)
			case "Password" :
				switch err.Tag() {
				case "required":
					message = fmt.Errorf("password field is required").Error()
				}
				return h.handleError(ctx, fiber.StatusBadRequest, message)
			}
		}
	}
	return nil
}

func (h *AuthHandler) Login(ctx *fiber.Ctx) error {
	creds := &models.LoginCredentials{}

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	if err := ctx.BodyParser(&creds); err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	if err := validate.Struct(creds); err != nil {
		return h.handleValidation(ctx, err)
	}

	token, user, err := h.service.Login(context, creds)

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	data := &fiber.Map{
		"token" : token,
		"user" : user,
	}
	return h.handleSucces(ctx, fiber.StatusOK, "Successfully logged in", data)
}

func (h *AuthHandler) Register(ctx *fiber.Ctx) error {
	creds := &models.AuthCredentials{}

	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	if err := ctx.BodyParser(&creds); err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	if err := validate.Struct(creds); err != nil {
		return h.handleValidation(ctx, err)
	}

	token, user, err := h.service.Register(context, creds)

	if err != nil {
		return h.handleError(ctx, fiber.StatusBadRequest, err.Error())
	}

	data := &fiber.Map{
		"token" : token,
		"user" : user,
	}

	return h.handleSucces(ctx, fiber.StatusOK, "Successfully logged in", data)
}

func NewAuthHandler(router fiber.Router, service models.AuthServices) {
	handler := &AuthHandler{
		service:service,
	}

	router.Post("/login", handler.Login)
	router.Post("/register", handler.Register)
}