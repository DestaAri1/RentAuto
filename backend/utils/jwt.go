package utils

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(claims jwt.MapClaims, signingMethod jwt.SigningMethod, secret string) (string, error) {
	token := jwt.NewWithClaims(signingMethod, claims)

	// Sign the token
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %v", err)
	}

	return tokenString, nil
}

func ValidateToken(tokenString string, secret string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
} 