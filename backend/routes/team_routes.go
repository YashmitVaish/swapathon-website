package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterTeamRoutes(router *gin.Engine) {
	api := router.Group("/api/teams")
	{
		api.POST("/register", controllers.RegisterTeam)
		api.POST("/login", controllers.LoginTeam)
		api.GET("/listproblems", controllers.ListProblems)

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/get-data", controllers.ViewDetails)
		}
	}
}
