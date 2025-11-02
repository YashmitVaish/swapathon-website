package controllers

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"time"

	"backend/database"
	"backend/models"
	"backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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

	if err := database.DB.Where("team_id = ?", teamID).First(&submission).Error; err != nil {
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

func reverse[T any](arr []T, start, end int) {
	for start < end {
		arr[start], arr[end] = arr[end], arr[start]
		start++
		end--
	}
}

func circularShiftInPlace[T any](arr []T, n int) {
	length := len(arr)
	if length == 0 {
		return
	}

	n = ((n % length) + length) % length
	if n == 0 {
		return
	}

	reverse(arr, 0, length-1)
	reverse(arr, 0, n-1)
	reverse(arr, n, length-1)
}

func PrepareSwap(c *gin.Context) {
	var teams []models.Team
	if err := database.DB.Find(&teams).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve teams",
		})
		return
	}

	if len(teams) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Need at least 2 teams to perform swap",
		})
		return
	}

	var submissions []models.Submission
	if err := database.DB.Find(&submissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve submissions",
		})
		return
	}

	if len(submissions) != len(teams) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Submissions and teams count mismatch",
		})
		return
	}

	ids := make([]uuid.UUID, len(teams))
	for i := range teams {
		ids[i] = teams[i].ID
	}

	// Seed random number generator for unpredictable swap offsets
	rand.Seed(time.Now().UnixNano())
	offset := rand.Intn(len(ids)-1) + 1 // ensure not 0 shift
	circularShiftInPlace(ids, offset)

	for i := range submissions {
		submissions[i].SwapWithID = ids[i]
		if err := database.DB.Save(&submissions[i]).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update submissions",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Swap assignments prepared successfully",
	})
}

type Notification struct {
	Heading string `json:"heading"`
	Message string `json:"message"`
}

func BroadcastNotification(c *gin.Context) {
	var notif Notification
	if err := c.BindJSON(&notif); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	if HubInstance == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Hub not initialized"})
		return
	}

	payload, err := json.Marshal(notif)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal notification"})
		return
	}
	HubInstance.Broadcast <- payload

	c.JSON(http.StatusOK, gin.H{"status": "broadcasted"})
}
