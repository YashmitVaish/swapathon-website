package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterInput struct {
	TeamName         string `json:"team_name" binding:"required"`
	LeaderName       string `json:"leader_name" binding:"required"`
	Email            string `json:"email" binding:"required,email"`
	Password         string `json:"password" binding:"required"`
	ProblemStatement string `json:"problem_statement"`
	Members          string `json:"members"`
}

func RegisterTeam(c *gin.Context) {
	var input RegisterInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "password hashing failed contact admin"})
		return
	}

	team := models.Team{
		TeamName:         input.TeamName,
		LeaderName:       input.LeaderName,
		Email:            input.Email,
		PasswordHash:     hash,
		ProblemStatement: input.ProblemStatement,
		Members:          input.Members,
	}

	if err := database.DB.Create(&team).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Team already exists"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "team registered succesfully "})

}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func LoginTeam(c *gin.Context) {
	var input LoginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var team models.Team

	if err := database.DB.Where("email = ?", input.Email).First(&team).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(input.Password, team.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(team.ID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})

}

func ListProblems(c *gin.Context) {
	var problems []models.Problem

	if err := database.DB.Find(&problems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch problems"})
		return
	}

	type problemDTO struct {
		ID               uint   `json:"id"`
		ProblemStatement string `json:"problem"`
		ExpectedSolution string `json:"solution"`
	}

	result := make([]problemDTO, len(problems))
	for i, p := range problems {
		result[i] = problemDTO{
			ID:               p.ID,
			ProblemStatement: p.ProblemStatement,
			ExpectedSolution: p.ExpectedSolution,
		}
	}

	c.JSON(http.StatusOK, gin.H{"problems": result})
}

func ViewDetails(c *gin.Context) {
	teamID := c.GetString("team_id")
	if teamID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized or invalid token"})
		return
	}

	var team models.Team

	if err := database.DB.Where("id = ?", teamID).First(&team).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"team_name":         team.TeamName,
		"leader_name":       team.LeaderName,
		"email_id":          team.Email,
		"problem_statement": team.ProblemStatement,
		"members":           team.Members,
	})

}

func ViewForSwap(c *gin.Context) {
	teamID := c.GetString("team_id")

	if teamID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized or Invalid token"})
		return
	}

	var submission models.Submission

	if err := database.DB.Where("swap_with_id = ?", teamID).First(&submission).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sol1":         submission.SOL1,
		"sol2":         submission.SOL2,
		"sol3":         submission.SOL3,
		"sol4":         submission.SOL4,
		"locked_index": submission.LockedIndex,
	})
}

func ViewFinal(c *gin.Context) {
	teamID := c.GetString("team_id")

	if teamID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized or Invalid token"})
		return
	}

	var submission models.Submission

	if err := database.DB.Where("team_id = ?", teamID).First(&submission).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"sol1":         submission.SOL1,
		"sol2":         submission.SOL2,
		"sol3":         submission.SOL3,
		"sol4":         submission.SOL4,
		"locked_index": submission.LockedIndex,
	})
}
