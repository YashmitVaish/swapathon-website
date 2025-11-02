package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(teamid string) (string, error) {
	var jwtsecret = []byte(os.Getenv("JWT_SECRET"))
	claims := jwt.MapClaims{
		"team_id": teamid,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtsecret)
}

func GenerateAdminToken() (string, error) {
	var jwtsecret = []byte(os.Getenv("JWT_ADMIN_SECRET"))
	claims := jwt.MapClaims{
		"role": "admin",
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtsecret)
}
