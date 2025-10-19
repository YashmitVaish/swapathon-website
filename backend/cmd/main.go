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
	routes.RegisterTeamRoutes(router)
	routes.AdminRoutes(router)

	router.Run(":8080")
}
