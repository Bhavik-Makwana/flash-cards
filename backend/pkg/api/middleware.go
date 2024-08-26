package api

import (
	"context"
	"flashcards/pkg/auth"
	"flashcards/pkg/config"
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

func corsMiddleware(config *config.Config, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowedOrigins := []string{config.CORSAllowedOrigin, "https://lobster-app-jgtjk.ondigitalocean.app"}
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			}
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
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
