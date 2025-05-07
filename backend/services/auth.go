package services

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/DestaAri1/RentAuto/models"
	"github.com/DestaAri1/RentAuto/utils"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

const defaultJWTSecret = "rent-auto-secret-key-2024"

type AuthService struct {
	repository models.AuthRepository
}

func (s *AuthService) Login(ctx context.Context, loginData *models.LoginCredentials) (string, *models.User, error) {
	// Get user with role preloaded
	user, err := s.repository.GetUser(ctx, "email = ?", loginData.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil, fmt.Errorf("invalid credentials")
		}
		return "", nil, err
	}

	// Verify password
	if !models.MatchesHash(loginData.Password, user.Password) {
		return "", nil, fmt.Errorf("invalid credentials")
	}

	// Ensure we have the role data
	if err := s.repository.GetUserWithRole(ctx, user.ID, user); err != nil {
		return "", nil, fmt.Errorf("failed to get user role: %v", err)
	}

	// Get JWT secret from environment or use default
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = defaultJWTSecret
	}

	// Create claims with proper role ID
	claims := jwt.MapClaims{
		"id":   user.ID.String(),
		"role": user.RoleID.String(), // Ensure this is the role ID, not the password
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	}

	token, err := utils.GenerateJWT(claims, jwt.SigningMethodHS256, secret)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

func (s *AuthService) Register(ctx context.Context, registerData *models.AuthCredentials) (string, *models.User, error) {
	if !models.IsValidEmail(registerData.Email) {
		return "", nil, fmt.Errorf("please provide a valid email to register")
	}

	if _, err := s.repository.GetUser(ctx, "email = ?", registerData.Email); !errors.Is(err, gorm.ErrRecordNotFound) {
		return "", nil, fmt.Errorf("the email is already used")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(registerData.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", nil, err
	}

	registerData.Password = string(hashedPassword)

	user, err := s.repository.RegisterUser(ctx, registerData)
	if err != nil {
		return "", nil, err
	}

	// Ensure we have the role data
	if err := s.repository.GetUserWithRole(ctx, user.ID, user); err != nil {
		return "", nil, fmt.Errorf("failed to get user role: %v", err)
	}

	// Get JWT secret from environment or use default
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = defaultJWTSecret
	}

	// Create claims with proper role ID
	claims := jwt.MapClaims{
		"id":   user.ID.String(),
		"role": user.RoleID.String(), // Ensure this is the role ID, not the password
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	}

	fmt.Printf("Register - Claims: %+v\n", claims)

	token, err := utils.GenerateJWT(claims, jwt.SigningMethodHS256, secret)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

func NewAuthService(repository models.AuthRepository) models.AuthServices {
	return &AuthService{
		repository: repository,
	}
}