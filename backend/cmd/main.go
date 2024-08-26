package main

import (
	"flag"
	"flashcards/pkg/api"
	"flashcards/pkg/config"
	"flashcards/pkg/database"
	"log"
	"net/http"
)

func main() {
	env := flag.String("env", "local", "Environment to run the server in (local or production)")
	flag.Parse()
	log.Println("env", *env)
	if *env != "local" && *env != "production" {
		log.Fatalf("Invalid environment: %s", *env)
		return
	}
	cfg, err := config.LoadConfig("config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	envConfig := loadEnvConfig(*cfg, *env)
	log.Println("envConfig", envConfig)
	h := database.InitDB()
	defer h.DB.Close()

	router := api.SetupRoutes(h, envConfig)

	port := envConfig.ServerPort
	log.Printf("Server starting on port %s in %s environment...", port, *env)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}
}

func loadEnvConfig(cfg map[string]config.Config, env string) config.Config {
	envConfig, exists := cfg[env]
	if !exists {
		log.Fatalf("Configuration for environment '%s' not found", env)
	}
	return envConfig
}
