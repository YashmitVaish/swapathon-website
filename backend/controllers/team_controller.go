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
