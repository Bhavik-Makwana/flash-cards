#!/bin/bash

# SQLite database file
DB_FILE="./flashcards.db"

# Check if the database file exists, if not create it
if [ ! -f "$DB_FILE" ]; then
    touch "$DB_FILE"
    echo "Database file created: $DB_FILE"
fi
# Drop all tables except users
sqlite3 "$DB_FILE" <<EOF
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS word_progress;
EOF

echo "All tables except 'users' have been dropped."

# SQL statements to create tables
sqlite3 "$DB_FILE" <<EOF
CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    japanese TEXT NOT NULL,
    romanji TEXT NOT NULL,
    english TEXT NOT NULL,
    category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    the TEXT,
    token TEXT
);

CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    word_id INTEGER,
    word_progress_id INTEGER,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (word_progress_id) REFERENCES word_progress(id)
);

CREATE TABLE IF NOT EXISTS word_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    word_id INTEGER NOT NULL,
    seen_count INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    last_attempted DATETIME,
    FOREIGN KEY (username) REFERENCES users(username),
    FOREIGN KEY (word_id) REFERENCES words(id),
    UNIQUE(username, word_id)
);
EOF

echo "Database tables have been created."
