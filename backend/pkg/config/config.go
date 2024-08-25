package config

import (
	"io/ioutil"
	"log"

	"gopkg.in/yaml.v2"
)

// Config holds the application configuration
type Config struct {
	JWTSecretKey string `yaml:"JWT_SECRET_KEY"`
}

// SecretKey holds the JWT secret key
var SecretKey []byte

// InitSecretKey initializes the JWT secret key
func InitSecretKey() {
	config, err := loadConfig("config.yaml")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	if config.JWTSecretKey == "" {
		log.Fatal("JWT_SECRET_KEY is not set in config.yaml")
	}

	SecretKey = []byte(config.JWTSecretKey)
}

// loadConfig reads the config file and returns a Config struct
func loadConfig(filename string) (*Config, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
