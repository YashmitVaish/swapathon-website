package models

import "gorm.io/gorm"

type Problem struct {
	gorm.Model
	ProblemStatement string `gorm:"type:text;not null"`
	ExpectedSolution string `gorm:"type:text;not null"`
}
