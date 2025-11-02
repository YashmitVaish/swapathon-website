package utils

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func getJWTSecret(secretName string) ([]byte, error) {
	secret := os.Getenv(secretName)
	if secret == "" {
		return nil, errors.New(secretName + " is not set or is empty")
	}
	if len(secret) < 32 {
		return nil, errors.New(secretName + " must be at least 32 characters long for security")
	}
	return []byte(secret), nil
}

func GenerateToken(teamid string) (string, error) {
	jwtsecret, err := getJWTSecret("JWT_SECRET")
	if err != nil {
		return "", err
	}
	claims := jwt.MapClaims{
		"team_id": teamid,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtsecret)
}

func GenerateAdminToken() (string, error) {
	jwtsecret, err := getJWTSecret("JWT_ADMIN_SECRET")
	if err != nil {
		return "", err
	}
	claims := jwt.MapClaims{
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtsecret)
}
