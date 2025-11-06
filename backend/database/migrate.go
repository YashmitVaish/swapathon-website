package database

import (
	"log"

	"backend/models"
)

func Migrate() {
	err := DB.AutoMigrate(
		&models.Team{},
		&models.Admin{},
		&models.Problem{},
		&models.Submission{},
		&models.User{},
	)

	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Database migrated successfully")
}
