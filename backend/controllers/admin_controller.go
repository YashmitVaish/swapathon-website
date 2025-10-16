package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginAdminInput struct{
	Username 	string `json:"username" binding:"required"`
	Password	string `json:"password" binding:"required"`
}

func LoginAdmin(c *gin.Context){
	var admininp LoginAdminInput

	if err := c.ShouldBindJSON(&admininp); err != nil{
		c.JSON(http.StatusBadRequest,gin.H{"error": err.Error()})
		return
	}

	var admin models.Admin

	if err:= database.DB.Where("username = ?",admininp.Username).First(&admin).Error; err != nil{
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(admininp.Password, admin.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token,err := utils.GenerateAdminToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func ListTeams(c *gin.Context) {
	var teams []models.Team

	if err := database.DB.Find(&teams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve teams",
		})
		return
	}

	for i := range teams {
		teams[i].PasswordHash = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"teams": teams,
	})
}

type AddProblemStatementInput struct{
	ProblemStatement string `json:"problem" binding:"required"`
	ExpectedSolution string  `json:"solution" binding:"required"`
}

func AddProblemStatement(c *gin.Context) {
	var input AddProblemStatementInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	problem := models.Problem{
		ProblemStatement: input.ProblemStatement,
		ExpectedSolution: input.ExpectedSolution,
	}

	if err := database.DB.Create(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create problem"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Problem created successfully",
		"problem": problem,
	})
}