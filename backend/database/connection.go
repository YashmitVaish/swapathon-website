package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"backend/config"
)

var DB *gorm.DB

func ConnectDatabase(cfg *config.Config) {
	databaseURL := os.Getenv("DATABASE_URL")

	var dsn string
	if databaseURL != "" {
		dsn = databaseURL
		log.Println("DB CONNECTED")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB = db
	log.Println("Connected to DB successfully")
}
