#!/bin/bash

# SQLite database file
DB_FILE="./flashcards.db"

# Check if the database file exists
if [ ! -f "$DB_FILE" ]; then
    echo "Error: Database file not found."
    exit 1
fi

# SQL statements to insert sample data
sqlite3 "$DB_FILE" <<EOF
INSERT INTO words (japanese, romaji, english, category) VALUES
('こんにちは', 'Konnichiwa', 'Hello', 'Essentials'),
('ありがとう', 'Arigatou', 'Thank you', 'Essentials'),
('すみません', 'Sumimasen', 'Excuse me / Sorry', 'Essentials'),
('はい', 'Hai', 'Yes', 'Essentials'),
('いいえ', 'Iie', 'No', 'Essentials'),
('お願いします', 'Onegaishimasu', 'Please', 'Essentials'),
('トイレはどこですか', 'Toire wa doko desu ka', 'Where is the bathroom?', 'Emergency'),
('助けて', 'Tasukete', 'Help!', 'Emergency'),
('病院', 'Byouin', 'Hospital', 'Emergency'),
('いくらですか', 'Ikura desu ka', 'How much is it?', 'Shopping'),
('これをください', 'Kore wo kudasai', 'I would like this, please', 'Shopping'),
('何時ですか', 'Nanji desu ka', 'What time is it?', 'Time'),
('メニューをください', 'Menyuu wo kudasai', 'Menu, please', 'Restaurant/Food'),
('水', 'Mizu', 'Water', 'Restaurant/Food'),
('駅はどこですか', 'Eki wa doko desu ka', 'Where is the station?', 'Travel'),
('チェックインしたいです', 'Chekkuin shitai desu', 'I would like to check in', 'Hotel');
EOF

echo "Sample data has been inserted into the words table."
