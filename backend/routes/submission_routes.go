package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SubmissionRoutes(router *gin.Engine) {
	api := router.Group("/submit")
	{
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/phase1", controllers.SubmitPhase1)
			protected.POST("/phase2", controllers.SubmitPhase2)
		}
	}
}
