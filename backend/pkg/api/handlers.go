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

func (h *GenericHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "OK")
	log.Println("OK")
}

func (h *GenericHandler) GetAllWords(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	stmt, err := h.DB.Prepare("SELECT * FROM words WHERE category = ?")
	if err != nil {
		log.Printf("Error preparing statement: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	rows, err := stmt.Query(category)
	if err != nil {
		log.Printf("Error querying words: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var words []models.Word
	for rows.Next() {
		var word models.Word
		err := rows.Scan(&word.ID, &word.Japanese, &word.Romanji, &word.English, &word.Category)
		if err != nil {
			log.Fatal(err)
		}
		words = append(words, word)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(words)
}

func (h *GenericHandler) GetWordsCategory(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	log.Printf("Category: %s", category)

	rows, err := h.DB.Query("SELECT id, japanese, romanji, english, category, audio_url FROM words WHERE category = ?", category)
	if err != nil {
		log.Printf("Error querying words: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var words []models.Word
	for rows.Next() {
		var word models.Word
		err := rows.Scan(&word.ID, &word.Japanese, &word.Romanji, &word.English, &word.Category, &word.AudioUrl)
		if err != nil {
			log.Fatal(err)
		}
		words = append(words, word)
	}
	log.Printf("Words: %v", words)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(words)
}

func (h *GenericHandler) ViewProgress(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value("user").(models.User)
	category := r.URL.Query().Get("category")
	log.Printf("/progress endpoint - User: %s, Category: %s", user, category)

	// Fetch user progress from the database, joining with words and word_progress
	query := `
		SELECT w.id, w.japanese, w.romanji, w.english, w.category,
			   wp.seen_count, wp.correct_count, wp.last_attempted, p.username
		FROM progress p
		JOIN words w ON w.id = p.word_id
		LEFT JOIN word_progress wp ON wp.word_id = w.id
		WHERE p.username = ? AND w.category = ?
	`
	log.Printf("Query: %s", query)
	rows, err := h.DB.Query(query, user.Username, category)
	if err != nil {
		http.Error(w, "Error fetching progress", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var progress []map[string]interface{}
	for rows.Next() {
		var wordID int
		var japanese, romanji, english, wordCategory, username string
		var seenCount, correctCount int
		var lastAttempted sql.NullTime
		if err := rows.Scan(&wordID, &japanese, &romanji, &english, &wordCategory, &seenCount, &correctCount, &lastAttempted, &username); err != nil {
			http.Error(w, "Error scanning progress data", http.StatusInternalServerError)
			return
		}
		progress = append(progress, map[string]interface{}{
			"word_id":        wordID,
			"japanese":       japanese,
			"romanji":        romanji,
			"english":        english,
			"category":       wordCategory,
			"seen_count":     seenCount,
			"correct_count":  correctCount,
			"last_attempted": lastAttempted.Time,
			"username":       username,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"username": user.Username,
		"category": category,
		"progress": progress,
	})
}
