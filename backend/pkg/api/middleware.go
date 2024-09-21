package api

import (
	"context"
	"flashcards/pkg/auth"
	"flashcards/pkg/config"
	"flashcards/pkg/models"
	"log"
	"net/http"
)

func AuthenticationMiddleware(config *config.Config, next http.HandlerFunc) http.HandlerFunc {
	ah := &auth.AuthHandler{Config: config}
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := ah.GetUserFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		ctx := context.WithValue(r.Context(), "user", user)
		log.Println("user", user)
		// ctx = context.WithValue(ctx, "token", token)

		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
func MockAuthenticationMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Create a mock user
		mockUser := models.User{
			Username: "test@aol.com",
		}

		// Add the mock user to the context
		ctx := context.WithValue(r.Context(), "user", mockUser)

		// Call the next handler with the modified request
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

func corsMiddleware(config *config.Config, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Default().Println("Origin", r.Header.Get("Origin"))
		if config.CORSAllowedOrigin == "*" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		} else {
			origin := r.Header.Get("Origin")
			allowedOrigins := []string{"https://lobster-app-jgtjk.ondigitalocean.app", "https://jpn-tourist-flashcards.com"}
			for _, allowedOrigin := range allowedOrigins {
				if origin == allowedOrigin {
					w.Header().Set("Access-Control-Allow-Origin", origin)
				}
			}
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		log.Default().Println("Header set", w.Header())
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	}
}

func LogMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s: %s", r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}
