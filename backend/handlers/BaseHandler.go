package handlers

import (
	"encoding/json"

	"github.com/DestaAri1/RentAuto/utils"
	"github.com/gofiber/fiber/v2"
)

type BaseHandler struct{}

func (h *BaseHandler) handlerError(ctx *fiber.Ctx, status int, message string) error {
	return utils.HandlerError(ctx, status, message)
}

func (h *BaseHandler) handlerSuccess(ctx *fiber.Ctx, status int, message string, data interface{}) error {
	return utils.HandlerSuccess(ctx, status, message, data)
}

func (h *BaseHandler) handleValidationError(ctx *fiber.Ctx, err error, validator *utils.ValidationErrorHandler) error {
	return utils.HandleValidationError(ctx, err, *validator)
}

func mapToStruct(m map[string]interface{}, s interface{}) error {
	data, err := json.Marshal(m)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, s)
}