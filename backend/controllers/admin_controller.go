package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginAdminInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func LoginAdmin(c *gin.Context) {
	var admininp LoginAdminInput

	if err := c.ShouldBindJSON(&admininp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin models.Admin

	if err := database.DB.Where("username = ?", admininp.Username).First(&admin).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(admininp.Password, admin.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateAdminToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

type Out struct {
	ID               string
	TeamName         string
	ProblemStatement string
}

func ListTeams(c *gin.Context) {
	var teams []models.Team

	if err := database.DB.Find(&teams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve teams",
		})
		return
	}

	out := make([]Out, len(teams))

	for i := range teams {
		out[i] = Out{
			ID:               teams[i].ID.String(),
			TeamName:         teams[i].TeamName,
			ProblemStatement: teams[i].ProblemStatement,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"teams": out,
	})
}

type AddProblemStatementInput struct {
	ProblemStatement string `json:"problem" binding:"required"`
	ExpectedSolution string `json:"solution" binding:"required"`
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

func ViewTeamDetails(c *gin.Context) {
	teamID := c.Query("id")

	if teamID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing id query parameter"})
		return
	}

	var details models.Team

	if err := database.DB.Where("id = ?", teamID).First(&details).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no record found"})
		return
	}

	var submission models.Submission

	if err := database.DB.Where("id = ?", teamID).First(&submission).Error; err != nil {
		c.JSON(http.StatusOK, gin.H{
			"team_name":         details.TeamName,
			"leader_name":       details.LeaderName,
			"problem_statement": details.ProblemStatement,
			"members":           details.Members,
			"submssion":         "no submission yet",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"team_name":         details.TeamName,
		"leader_name":       details.LeaderName,
		"problem_statement": details.ProblemStatement,
		"members":           details.Members,
		"submission":        "submitted",
		"sol1":              submission.SOL1,
		"sol2":              submission.SOL2,
		"sol3":              submission.SOL3,
		"sol4":              submission.SOL4,
	})
}
