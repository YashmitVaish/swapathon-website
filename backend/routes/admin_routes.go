package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(router *gin.Engine) {
	api := router.Group("/api/admin")
	{
		api.POST("/login", controllers.LoginAdmin)

		protected := api.Group("/")
		protected.Use(middleware.AdminMiddleware())
		{
			protected.GET("/list-teams", controllers.ListTeams)
			protected.GET("/list-users", controllers.ListUsers)
			protected.POST("/add-problem", controllers.AddProblemStatement)
			protected.GET("/team", controllers.ViewTeamDetails)
			protected.GET("/swap", controllers.PrepareSwap)
			protected.POST("/notify", controllers.BroadcastNotification)
		}
	}
}
