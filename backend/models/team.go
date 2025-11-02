package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Team struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey"`
	TeamName         string    `gorm:"unique;not null"`
	LeaderName       string    `gorm:"not null"`
	Email            string    `gorm:"unique;not null"`
	PasswordHash     string    `gorm:"not null"`
	ProblemStatement string    `gorm:"type:text"`
	Members          string
}

// BeforeCreate hook to generate UUID before creating a new team
func (t *Team) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}
