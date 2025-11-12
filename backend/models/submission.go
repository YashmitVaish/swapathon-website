package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Submission struct {
	gorm.Model
	TeamID           uuid.UUID `gorm:"type:uuid;not null;index"`
	SwapWithID       uuid.UUID `gorm:"type:uuid;index"`
	ProblemStatement string    `gorm:"type:text;not null"`
	SOL1             string    `gorm:"type:text;not null"`
	SOL2             string    `gorm:"type:text;not null"`
	SOL3             string    `gorm:"type:text;not null"`
	SOL4             string    `gorm:"type:text;not null"`
	LockedIndex      int       `gorm:"not null;default:0"`
	IsFinal          bool      `gorm:"default:false"`
	Evaluation       bool      `gorm:"default:false"`
	RevealedIndex    *int       `gorm:"default:null"`
}
