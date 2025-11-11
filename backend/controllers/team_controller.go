package controllers

import (
	"backend/database"
	"backend/models"
	"backend/utils"
	"fmt"
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

type RevealFeatureInput struct {
	FeatureIndex int `json:"feature_index" binding:"required,min=1,max=4"`
}

func RevealFeature(c *gin.Context) {
	teamID := c.GetString("team_id")

	if teamID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized or Invalid token"})
		return
	}

	var input RevealFeatureInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	var submission models.Submission
	if err := database.DB.Where("swap_with_id = ?", teamID).First(&submission).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "no assigned submission found"})
		return
	}

	if submission.LockedIndex == input.FeatureIndex {
		c.JSON(http.StatusForbidden, gin.H{
			"error":         "This feature is locked and cannot be edited",
			"is_locked":     true,
			"feature_index": input.FeatureIndex,
		})
		return
	}


	var content string
	switch input.FeatureIndex {
	case 1:
		content = submission.SOL1
	case 2:
		content = submission.SOL2
	case 3:
		content = submission.SOL3
	case 4:
		content = submission.SOL4
	}

	c.JSON(http.StatusOK, gin.H{
		"feature_index": input.FeatureIndex,
		"content":       content,
		"is_locked":     false,
		"submission_id": submission.ID,
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

type UserInput struct {
	Name        string `json:"name" binding:"required" `
	Email       string `json:"email" binding:"required,email"`
	RollNumber  int    `json:"rollnumber" binding:"required"`
	PhoneNumber int    `json:"phonenumber" binding:"required"`
}

func RegisterUser(c *gin.Context) {
	var uinput UserInput
	if err := c.ShouldBindJSON(&uinput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	user := models.User{
		Name:        uinput.Name,
		Email:       uinput.Email,
		RollNumber:  uinput.RollNumber,
		PhoneNumber: uinput.PhoneNumber,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or User already exists"})
		fmt.Print(err.Error())
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered succesfully "})
}
