package models

import (
	"database/sql"

	"github.com/golang-jwt/jwt/v4"
)

type Word struct {
	ID       int    `json:"id"`
	Japanese string `json:"japanese"`
	Romanji  string `json:"romanji"`
	English  string `json:"english"`
	Category string `json:"category"`
}
type Handler struct {
	DB *sql.DB
}

type User struct {
	ID       int        `json:"id"`
	Username string     `json:"username"`
	Password string     `json:"-"` // The "-" tag ensures the password is not included in JSON output
	Token    *jwt.Token `json:"-"`
}

type Progress struct {
	ID             int    `json:"id"`
	Username       string `json:"username"`
	LastUpdated    string `json:"last_updated"`
	WordId         int    `json:"word_id"`
	WordProgressId int    `json:"word_progress_id"`
}

type WordProgress struct {
	ID            int    `json:"id"`
	Username      string `json:"username"`
	WordID        int    `json:"word_id"`
	SeenCount     int    `json:"seen_count"`
	CorrectCount  int    `json:"correct_count"`
	LastAttempted string `json:"last_attempted"`
}
