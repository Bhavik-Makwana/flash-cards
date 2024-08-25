package api

import (
	"database/sql"
	"encoding/json"
	"flashcards/pkg/models"
	"fmt"
	"log"
	"net/http"
)

type GenericHandler struct {
	models.Handler
}

func (h *GenericHandler) HelloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!")
	log.Println("Hello, World!")
}

func (h *GenericHandler) GetAllWords(w http.ResponseWriter, r *http.Request) {
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

	var words []models.Word
	for rows.Next() {
		var word models.Word
		err := rows.Scan(&word.ID, &word.Japanese, &word.Romaji, &word.English, &word.Category)
		if err != nil {
			log.Fatal(err)
		}
		words = append(words, word)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(words)
}

func (h *GenericHandler) ViewProgress(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(models.User)
	log.Printf("User: %s", user)
	// Fetch user progress from the database
	rows, err := h.DB.Query("SELECT category, words_learned FROM progress WHERE username = ?", user.Username)
	if err != nil {
		http.Error(w, "Error fetching progress", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var progress []map[string]interface{}
	for rows.Next() {
		var category string
		var wordsLearned int
		if err := rows.Scan(&category, &wordsLearned); err != nil {
			http.Error(w, "Error scanning progress data", http.StatusInternalServerError)
			return
		}
		progress = append(progress, map[string]interface{}{
			"category":      category,
			"words_learned": wordsLearned,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"username": user.Username,
		"progress": progress,
	})
}
