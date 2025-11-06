package main

import (
	"backend/config"
	"backend/database"
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	database.ConnectDatabase(cfg)
	database.Migrate()

	router := gin.Default()
	routes.TeamRoutes(router)
	routes.AdminRoutes(router)
	routes.SubmissionRoutes(router)

	router.Run(":8080")
}