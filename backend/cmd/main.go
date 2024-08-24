package main

import (
	"flashcards/pkg/api"
	"flashcards/pkg/database"
	"log"
	"net/http"
)

func main() {
	h := database.InitDB()
	defer h.DB.Close()

	router := api.SetupRoutes(h)

	log.Println("Server starting on port 8080...")
	if err := http.ListenAndServe(":8080", router); err != nil {
		log.Fatal(err)
	}
}
