package models

import (
	"gorm.io/gorm"
)

type Submission struct {
	gorm.Model
	TeamID           uint `gorm:"not null"`
	SwapWithID       uint
	ProblemStatement string `gorm:"type:text;not null"`
	SOL1             string `gorm:"type:text;not null"`
	SOL2             string `gorm:"type:text;not null"`
	SOL3             string `gorm:"type:text;not null"`
	SOL4             string `gorm:"type:text;not null"`
	Locked           string `gorm:"type:text"`
	Evaluation       bool   `gorm:"default:false"`
}
