package main

import (
	"backend/config"
	"backend/database"
)

func main() {
	cfg := config.LoadConfig()
	database.ConnectDatabase(cfg)	
}
