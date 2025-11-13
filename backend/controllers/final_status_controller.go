package controllers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetFinalStatus checks if all teams have completed Phase 2
func GetFinalStatus(c *gin.Context) {
	teamID := c.GetString("team_id")

	if teamID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized or invalid token"})
		return
	}

	// Count total submissions (teams that submitted Phase 1)
	var totalSubmissions int64
	if err := database.DB.Model(&models.Submission{}).Count(&totalSubmissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count submissions"})
		return
	}

	// If no submissions exist, Phase 1 hasn't started
	if totalSubmissions == 0 {
		c.JSON(http.StatusOK, gin.H{
			"all_completed": false,
			"message":       "No submissions found. Please complete Phase 1 first.",
		})
		return
	}

	// Count submissions where IsFinal = true (Phase 2 completed)
	var completedSubmissions int64
	if err := database.DB.Model(&models.Submission{}).Where("is_final = ?", true).Count(&completedSubmissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count completed submissions"})
		return
	}

	// Check if all teams have completed Phase 2
	allCompleted := completedSubmissions == totalSubmissions

	if allCompleted {
		c.JSON(http.StatusOK, gin.H{
			"all_completed": true,
			"message":       "All teams have completed Phase 2. You can now view your final submission.",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"all_completed": false,
			"message":       "Waiting for all teams to complete Phase 2...",
			"completed":     completedSubmissions,
			"total":         totalSubmissions,
		})
	}
}
