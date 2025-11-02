package main

import (
	"backend/config"
	"backend/database"
	"backend/routes"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	
	// Validate JWT secrets are set
	if os.Getenv("JWT_SECRET") == "" {
		log.Fatal("JWT_SECRET environment variable is required but not set")
	}
	if os.Getenv("JWT_ADMIN_SECRET") == "" {
		log.Fatal("JWT_ADMIN_SECRET environment variable is required but not set")
	}
	
	database.ConnectDatabase(cfg)
	database.Migrate()

	router := gin.Default()
	routes.TeamRoutes(router)
	routes.AdminRoutes(router)
	routes.SubmissionRoutes(router)

	router.Run(":8080")
}
