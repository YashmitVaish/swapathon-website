package main

import (
	"github.com/gin-gonic/gin"
	"backend/config"
	"backend/database"
	"backend/routes"
)

func main() {
	cfg := config.LoadConfig()
	database.ConnectDatabase(cfg)
	database.DB.AutoMigrate()

	router := gin.Default()
	routes.RegisterTeamRoutes(router)

	router.Run(":8080")
}
