package config

import (
	"os"

	"gopkg.in/yaml.v2"
)

// Config holds the application configuration
type Config struct {
	JWTSecretKey      string `yaml:"JWT_SECRET_KEY"`
	CORSAllowedOrigin string `yaml:"CORS_ALLOWED_ORIGIN"`
	DBHost            string `yaml:"DB_HOST"`
	DBPort            string `yaml:"DB_PORT"`
	DBName            string `yaml:"DB_NAME"`
	DBUser            string `yaml:"DB_USER"`
	DBPassword        string `yaml:"DB_PASSWORD"`
	ServerPort        string `yaml:"SERVER_PORT"`
	LogLevel          string `yaml:"LOG_LEVEL"`
}

// LoadConfig reads the config file and returns a Config struct
func LoadConfig(filename string) (*map[string]Config, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config map[string]Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}
