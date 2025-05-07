package middlewares

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

var (
	// Default JWT secret if not configured in environment
	defaultJWTSecret = "rent-auto-secret-key-2024"
)

func errorMiddleware(ctx *fiber.Ctx, status int, message string) error {
	return ctx.Status(status).JSON(&fiber.Map{
		"status":  "fail",
		"message": message,
	})
}

func AuthProtected(db *gorm.DB) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		authHeader := ctx.Get("Authorization")
		if authHeader == "" {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Unauthorized")
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid token format")
		}

		tokenString := tokenParts[1]
		
		// Get JWT secret from environment or use default
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = defaultJWTSecret
		}

		// Use the ValidateToken function from utils
		token, err := utils.ValidateToken(tokenString, secret)
		if err != nil {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, fmt.Sprintf("Invalid token: %v", err))
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid token claims")
		}

		// Check token expiration
		exp, ok := claims["exp"].(float64)
		if !ok {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid expiration claim")
		}
		if time.Now().Unix() > int64(exp) {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Token expired")
		}

		// Get user ID from claims
		userIdStr, ok := claims["id"].(string)
		if !ok {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid user ID claim")
		}

		userId, err := uuid.Parse(userIdStr)
		if err != nil {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid user ID format")
		}

		// Get role ID from claims
		roleIdStr, ok := claims["role"].(string)
		if !ok {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid role ID claim")
		}

		roleId, err := uuid.Parse(roleIdStr)
		if err != nil {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid role ID format")
		}

		// Get user from database to verify role
		var user models.User
		if err := db.Preload("Role").First(&user, "id = ?", userId).Error; err != nil {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "User not found")
		}

		// Verify that the role ID matches
		if user.RoleID != roleId {
			return errorMiddleware(ctx, fiber.StatusUnauthorized, "Invalid role")
		}

		// Set user ID and role ID in context
		ctx.Locals("userId", userId)
		ctx.Locals("roleId", roleId)

		return ctx.Next()
	}
}