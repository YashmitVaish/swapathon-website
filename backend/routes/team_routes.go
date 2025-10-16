package routes

import (
	"github.com/gin-gonic/gin"
	"backend/controllers"
	"backend/middleware"
)

func RegisterTeamRoutes(router *gin.Engine) {
	api := router.Group("/api/teams")
	{
		api.POST("/register", controllers.RegisterTeam)
		api.POST("/login", controllers.LoginTeam)

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/dashboard", func(c *gin.Context) {
				c.JSON(200, gin.H{"message": "Welcome to your dashboard!"})
			})
		}
	}
}
