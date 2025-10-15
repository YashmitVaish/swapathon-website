package models

import (
	"github.com/google/uuid"
)

type Team struct {
	ID               uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	TeamName         string    `gorm:"unique;not null"`
	LeaderName       string    `gorm:"not null"`
	Email            string    `gorm:"unique;not null"`
	PasswordHash     string    `gorm:"not null"`
	ProblemStatement string    `gorm:"type:text"`
	Members          string
}
