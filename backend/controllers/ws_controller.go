package controllers

import (
	"log"
	"net/http"

	"backend/realtime"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var HubInstance = realtime.NewHub()

func init() {
	go HubInstance.Run()
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func WebSocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to establish WebSocket"})
		return
	}

	client := &realtime.Client{
		Hub:  HubInstance,
		Conn: conn,
		Send: make(chan []byte, 1024),
	}

	HubInstance.Register <- client
	go client.WritePump()
	go client.ReadPump()
}
