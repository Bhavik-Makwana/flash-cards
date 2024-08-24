package api

import (
	"flashcards/pkg/auth"
	"flashcards/pkg/models"

	"github.com/gorilla/mux"
)

func SetupRoutes(h *models.Handler) *mux.Router {
	ah := &auth.AuthHandler{Handler: *h}
	gh := &GenericHandler{Handler: *h}
	r := mux.NewRouter()
	r.HandleFunc("/", gh.HelloHandler)
	r.HandleFunc("/words", gh.GetAllWords)
	r.HandleFunc("/progress", gh.ViewProgress)
	r.HandleFunc("/login", ah.Login)
	r.HandleFunc("/signup", ah.Signup)
	return r
}
