package models

import "database/sql"

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
