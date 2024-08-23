package main

import (
	"fmt"
	"log"
	"net/http"

	"database/sql"
	"encoding/json"

	"github.com/gorilla/mux"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db := initDB()
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/", helloHandler)
	r.HandleFunc("/words", getAllWords)

	fmt.Println("Server starting on port 8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!")
	log.Println("Hello, World!")
}

type Word struct {
	ID       int    `json:"id"`
	Japanese string `json:"japanese"`
	Romaji   string `json:"romaji"`
	English  string `json:"english"`
	Category string `json:"category"`
}

func getAllWords(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "./flashcards.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM words")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var words []Word
	for rows.Next() {
		var word Word
		err := rows.Scan(&word.ID, &word.Japanese, &word.Romaji, &word.English, &word.Category)
		if err != nil {
			log.Fatal(err)
		}
		words = append(words, word)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(words)
}

func initDB() *sql.DB {
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

	return db
}
