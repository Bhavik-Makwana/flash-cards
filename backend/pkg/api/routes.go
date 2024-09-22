package api

import (
	"flashcards/pkg/auth"
	"flashcards/pkg/config"
	"flashcards/pkg/models"
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRoutes(h *models.Handler, cfg config.Config) *mux.Router {
	ah := &auth.AuthHandler{Handler: *h, Config: &cfg}
	gh := &GenericHandler{Handler: *h}
	r := mux.NewRouter()

	chain := func(h http.HandlerFunc) http.HandlerFunc {
		return corsMiddleware(&cfg, LogMiddleware(h))
	}

	// Apply CORS middleware to each route
	v1 := r.PathPrefix("/api/v1").Subrouter()
	v1.HandleFunc("/", chain(gh.HelloHandler))
	v1.HandleFunc("/words", chain(gh.GetAllWords))
	v1.Handle("/progress", chain(MockAuthenticationMiddleware(gh.ViewProgress)))
	v1.HandleFunc("/login", chain(ah.Login))
	v1.HandleFunc("/signup", chain(ah.Signup))
	v1.HandleFunc("/health_check", chain(gh.HealthCheck))
	v1.HandleFunc("/words/category", chain(gh.GetWordsCategory))
	v1.HandleFunc("/user", chain(ah.GetUser))
	return r
}
