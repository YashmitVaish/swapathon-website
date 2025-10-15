package main

import (
	"backend/config"
	"backend/database"
)

func main() {
	cfg := config.LoadConfig()
	database.ConnectDatabase(cfg)
// 	database.DB.Exec(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
//  database.Migrate()

}
