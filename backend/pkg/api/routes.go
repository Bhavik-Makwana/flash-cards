package api

import (
	"flashcards/pkg/auth"
	"flashcards/pkg/models"
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRoutes(h *models.Handler) *mux.Router {
	ah := &auth.AuthHandler{Handler: *h}
	gh := &GenericHandler{Handler: *h}
	r := mux.NewRouter()

	chain := func(h http.HandlerFunc) http.HandlerFunc {
		return corsMiddleware(LogMiddleware(h))
	}
	// Apply CORS middleware to each route
	r.HandleFunc("/", chain(gh.HelloHandler))
	r.HandleFunc("/words", chain(gh.GetAllWords))
	r.Handle("/progress", chain(AuthenticationMiddleware(gh.ViewProgress)))
	r.HandleFunc("/login", chain(ah.Login))
	r.HandleFunc("/signup", chain(ah.Signup))

	return r
}
