package api

import (
	"database/sql"
	"encoding/json"
	"flashcards/pkg/models"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
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
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract the token from the Authorization header
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		http.Error(w, "Missing authorization token", http.StatusUnauthorized)
		return
	}

	// Remove 'Bearer ' prefix if present
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// Parse and validate the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte("your-secret-key"), nil // Use the same secret key as in login function
	})

	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username := claims["username"].(string)

		// Fetch user progress from the database
		rows, err := h.DB.Query("SELECT category, words_learned FROM progress WHERE username = ?", username)
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
			"username": username,
			"progress": progress,
		})
	} else {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
	}
}
