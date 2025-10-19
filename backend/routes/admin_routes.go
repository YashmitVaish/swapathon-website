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
			protected.GET("/dashboard-admin", controllers.ListTeams)
			protected.POST("/add-problem", controllers.AddProblemStatement)
		}
	}
}
