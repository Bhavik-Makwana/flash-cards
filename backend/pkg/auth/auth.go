package auth

import (
	"database/sql"
	"encoding/json"
	"flashcards/pkg/config"
	"flashcards/pkg/models"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	models.Handler
	Config *config.Config
}

func (h *AuthHandler) IsUserLoggedIn(r *http.Request) bool {
	_, err := h.GetUserFromToken(r)
	return err == nil
}

func (h *AuthHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	user, err := h.GetUserFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *AuthHandler) GetUserFromToken(r *http.Request) (models.User, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return models.User{}, fmt.Errorf("unauthorized")
	}

	bearerToken := strings.Split(authHeader, " ")
	if len(bearerToken) != 2 {
		return models.User{}, fmt.Errorf("unauthorized")
	}

	token, err := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(h.Config.JWTSecretKey), nil
	})

	if err != nil {
		return models.User{}, fmt.Errorf("unauthorized")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		exp := claims["exp"].(float64)
		if int64(exp) < time.Now().Unix() {
			return models.User{}, fmt.Errorf("token expired")
		}
		username := claims["username"].(string)
		log.Printf("Username: %s", username)
		return models.User{Username: username, Token: token}, nil
	}

	return models.User{}, fmt.Errorf("unauthorized")
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	log.Printf("Login method called")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Printf("Received body: %s", body)
	err = json.Unmarshal(body, &credentials)
	if err != nil {
		log.Printf("Error unmarshalling request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Printf("Credentials: %v", credentials)

	// Check if user exists in database
	var storedPassword []byte
	err = h.DB.QueryRow("SELECT password FROM users WHERE username = ?", credentials.Username).Scan(&storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusUnauthorized)
		} else {
			log.Printf("Error querying database: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword(storedPassword, []byte(credentials.Password)); err == nil {
		// Authentication successful
		token := h.generateToken(credentials.Username)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"token": token})
	} else {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
	}
}

func (h *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newUser struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Basic validation
	if newUser.Username == "" || newUser.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	// Insert the new user into the database
	_, err = h.DB.Exec("INSERT INTO users (username, password) VALUES (?, ?)", newUser.Username, string(hashedPassword))
	if err != nil {
		// Check for unique constraint violation (username already exists)
		if strings.Contains(err.Error(), "UNIQUE constraint failed") {
			http.Error(w, "Username already exists", http.StatusConflict)
		} else {
			http.Error(w, "Error creating user", http.StatusInternalServerError)
		}
		return
	}

	// User created successfully
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func (h *AuthHandler) generateToken(username string) string {
	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	})

	// Sign the token with a secret key
	secretKey := []byte(h.Config.JWTSecretKey)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		log.Printf("Error generating token: %v", err)
		return ""
	}
	return tokenString
}
