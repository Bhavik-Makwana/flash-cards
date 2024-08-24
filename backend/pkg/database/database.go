package database

import (
	"database/sql"
	"flashcards/pkg/models"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDB() *models.Handler {
	db, err := sql.Open("sqlite3", "./flashcards.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS words (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			japanese TEXT NOT NULL,
			romaji TEXT NOT NULL,
			english TEXT NOT NULL,
			category TEXT NOT NULL
		)
	`)
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS progress (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			category TEXT NOT NULL,
			words_learned INTEGER NOT NULL DEFAULT 0,
			last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (username) REFERENCES users(username),
			UNIQUE(username, category)
		)
	`)
	if err != nil {
		log.Fatal(err)
	}
	return &models.Handler{DB: db}
}
