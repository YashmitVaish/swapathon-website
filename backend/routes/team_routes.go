package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func TeamRoutes(router *gin.Engine) {
	api := router.Group("/teams")
	{
		api.POST("/register", controllers.RegisterTeam)
		api.POST("/login", controllers.LoginTeam)
		api.GET("/listproblems", controllers.ListProblems)
		api.GET("/ws", controllers.WebSocketHandler)
		api.POST("/register-user", controllers.RegisterUser)

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/get-data", controllers.ViewDetails)
			protected.GET("/swap-status", controllers.GetSwapStatus)
			protected.GET("/final-status", controllers.GetFinalStatus)
			protected.POST("/reveal-feature", controllers.RevealFeature)
			protected.GET("/viewfinal", controllers.ViewFinal)
		}
	}
}
