package controllers

import (
	"backend/database"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetSwapStatus checks if the team has submitted Phase 1 and if swap is ready
func GetSwapStatus(c *gin.Context) {
	teamID := c.GetString("team_id")

	if teamID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized or invalid token"})
		return
	}

	// Parse team ID
	teamUUID, err := uuid.Parse(teamID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
		return
	}

	// Check if team has submitted Phase 1
	var submission models.Submission
	err = database.DB.Where("team_id = ?", teamUUID).First(&submission).Error

	if err != nil {
		// Team hasn't submitted Phase 1 yet
		c.JSON(http.StatusOK, gin.H{
			"phase1_submitted": false,
			"swap_ready":       false,
			"message":          "Please submit Phase 1 first",
		})
		return
	}

	// Check if swap has been assigned (SwapWithID is not null/zero)
	swapReady := submission.SwapWithID != uuid.Nil

	if swapReady {
		c.JSON(http.StatusOK, gin.H{
			"phase1_submitted": true,
			"swap_ready":       true,
			"message":          "Swap is ready! You can now edit features.",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"phase1_submitted": true,
			"swap_ready":       false,
			"message":          "Waiting for admin to trigger swap assignments...",
		})
	}
}
