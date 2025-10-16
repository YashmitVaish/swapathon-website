package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtsecret = []byte(os.Getenv("JWT_SECRET"))

func GenerateToken(teamid string) (string, error) {
	claims := jwt.MapClaims{
		"team_id": teamid,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtsecret)
}
