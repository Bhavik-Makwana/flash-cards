package models

import (
	"database/sql"

	"github.com/golang-jwt/jwt/v4"
)

type Word struct {
	ID       int    `json:"id"`
	Japanese string `json:"japanese"`
	Romaji   string `json:"romaji"`
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
