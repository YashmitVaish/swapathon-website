package controllers

import (
	"backend/database"
	"backend/models"
	"fmt"
	"net/http"

	"github.com/google/uuid"

	"github.com/gin-gonic/gin"
)

type SubmissionInput struct {
	ProblemStatement string `json:"problem" binding:"required"`
	SOL1             string `json:"sol1" binding:"required"`
	SOL2             string `json:"sol2" binding:"required"`
	SOL3             string `json:"sol3" binding:"required"`
	SOL4             string `json:"sol4" binding:"required"`
	LockedIndex      int    `json:"locked_index" binding:"required"`
}

func SubmitPhase1(c *gin.Context) {
	var input SubmissionInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	teamID := c.GetString("team_id")

	var existing models.Submission
	if err := database.DB.Where("team_id = ?", teamID).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Already submitted in Phase 1"})
		return
	}

	sub := models.Submission{
		TeamID:           uuid.MustParse(teamID),
		ProblemStatement: input.ProblemStatement,
		SOL1:             input.SOL1,
		SOL2:             input.SOL2,
		SOL3:             input.SOL3,
		SOL4:             input.SOL4,
		LockedIndex:      input.LockedIndex,
	}

	if err := database.DB.Create(&sub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save submission"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "Phase 1 submission complete",
		"locked_idea": fmt.Sprintf("SOL%d", input.LockedIndex),
	})
}

func SubmitPhase2(c *gin.Context) {
	var input struct {
		SolutionIndex   int    `json:"solution_index" binding:"required"`
		UpdatedSolution string `json:"updated_solution" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	swapTeamID := c.GetString("team_id")
	if swapTeamID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized or invalid token"})
		return
	}

	var submission models.Submission
	if err := database.DB.Where("swap_with_id = ?", swapTeamID).First(&submission).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "No assigned submission found for your team"})
		return
	}

	if input.SolutionIndex == submission.LockedIndex {
		c.JSON(http.StatusForbidden, gin.H{"error": "Locked submission chosen please choose another"})
		return
	}

	if submission.IsFinal {
		c.JSON(http.StatusForbidden, gin.H{"error": "Submission is locked cannot modify again"})
		return
	}

	switch input.SolutionIndex {
	case 1:
		submission.SOL1 = input.UpdatedSolution
	case 2:
		submission.SOL2 = input.UpdatedSolution
	case 3:
		submission.SOL3 = input.UpdatedSolution
	case 4:
		submission.SOL4 = input.UpdatedSolution
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid solution index. Must be between 1 and 4"})
		return
	}

	submission.IsFinal = true

	if err := database.DB.Save(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update submission"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Phase 2 update successful",
		"updated_field": input.SolutionIndex,
		"updated_idea":  input.UpdatedSolution,
	})
}
