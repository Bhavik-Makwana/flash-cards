#!/bin/bash

# SQLite database file
DB_FILE="./flashcards.db"

# Check if the database file exists
if [ ! -f "$DB_FILE" ]; then
    echo "Error: Database file not found."
    exit 1
fi

# Delete data from words, word_progress, and progress tables
sqlite3 "$DB_FILE" <<EOF
DELETE FROM words;
DELETE FROM word_progress;
DELETE FROM progress;
EOF

echo "Data has been deleted from the words, word_progress, and progress tables."

# SQL statements to insert sample data
sqlite3 "$DB_FILE" <<EOF
INSERT INTO words (japanese, romanji, english, category, audio_url) VALUES
('こんにちは', 'Konnichiwa', 'Hello', 'Essentials', 'hello.mp3'),
('ありがとう', 'Arigatou', 'Thank you', 'Essentials', 'thank_you.mp3'),
('すみません', 'Sumimasen', 'Excuse me / Sorry', 'Essentials', 'excuse_me.mp3'),
('はい', 'Hai', 'Yes', 'Essentials', 'yes.mp3'),
('いいえ', 'Iie', 'No', 'Essentials', 'no.mp3'),
('お願いします', 'Onegaishimasu', 'Please', 'Essentials', 'please.mp3'),
('トイレはどこですか', 'Toire wa doko desu ka', 'Where is the bathroom?', 'Emergency', 'where_is_the_bathroom.mp3'),
('助けて', 'Tasukete', 'Help!', 'Emergency', 'help.mp3'),
('病院', 'Byouin', 'Hospital', 'Emergency', 'hospital.mp3'),
('いくらですか', 'Ikura desu ka', 'How much is it?', 'Shopping', 'how_much_is_it.mp3'),
('これをください', 'Kore wo kudasai', 'I would like this, please', 'Shopping', 'i_would_like_this_please.mp3'),
('何時ですか', 'Nanji desu ka', 'What time is it?', 'Time', 'what_time_is_it.mp3'),
('メニューをください', 'Menyuu wo kudasai', 'Menu, please', 'Restaurant/Food', 'menu_please.mp3'),
('水', 'Mizu', 'Water', 'Restaurant/Food', 'water.mp3'),
('駅はどこですか', 'Eki wa doko desu ka', 'Where is the station?', 'Travel', 'where_is_the_station.mp3'),
('チェックインしたいです', 'Chekkuin shitai desu', 'I would like to check in', 'Hotel', 'i_would_like_to_check_in.mp3');
EOF

echo "Sample data has been inserted into the words table."

# Insert sample data for WordProgress table
sqlite3 "$DB_FILE" <<EOF
INSERT INTO word_progress (username, word_id, seen_count, correct_count, last_attempted) VALUES
('test@aol.com', 1, 5, 3, '2023-06-01 10:00:00'),
('test@aol.com', 2, 3, 2, '2023-06-02 11:30:00'),
('test@aol.com', 3, 4, 4, '2023-06-03 14:45:00'),
('test@aol.com', 4, 2, 1, '2023-06-04 09:15:00'),
('test@aol.com', 5, 3, 3, '2023-06-05 11:30:00'),
('test@aol.com', 6, 1, 1, '2023-06-06 13:45:00'),
('test@aol.com', 7, 2, 2, '2023-06-07 15:00:00'),
('test@aol.com', 8, 3, 2, '2023-06-08 16:15:00'),
('test@aol.com', 9, 1, 1, '2023-06-09 17:30:00'),
('test@aol.com', 10, 2, 1, '2023-06-10 18:45:00'),
('test@aol.com', 11, 3, 3, '2023-06-11 20:00:00'),
('test@aol.com', 12, 1, 0, '2023-06-12 21:15:00'),
('test@aol.com', 13, 2, 2, '2023-06-13 22:30:00'),
('test@aol.com', 14, 1, 1, '2023-06-14 23:45:00'),
('test@aol.com', 15, 2, 1, '2023-06-15 01:00:00'),
('test@aol.com', 16, 1, 1, '2023-06-16 02:15:00'),
('user', 5, 1, 0, '2023-06-04 16:20:00');
EOF

echo "Sample data has been inserted into the word_progress table."

# Insert sample data for Progress table
sqlite3 "$DB_FILE" <<EOF
INSERT INTO progress (username, last_updated, word_id, word_progress_id) VALUES
('test@aol.com', '2023-06-01 10:00:00', 1, 1),
('test@aol.com', '2023-06-02 11:30:00', 2, 2),
('test@aol.com', '2023-06-03 14:45:00', 3, 3),
('test@aol.com', '2023-06-04 09:15:00', 4, 4),
('test@aol.com', '2023-06-05 11:30:00', 5, 5),
('test@aol.com', '2023-06-06 13:45:00', 6, 6),
('test@aol.com', '2023-06-07 15:00:00', 7, 7),
('test@aol.com', '2023-06-08 16:15:00', 8, 8),
('test@aol.com', '2023-06-09 17:30:00', 9, 9),
('test@aol.com', '2023-06-10 18:45:00', 10, 10),
('test@aol.com', '2023-06-11 20:00:00', 11, 11),
('test@aol.com', '2023-06-12 21:15:00', 12, 12),
('test@aol.com', '2023-06-13 22:30:00', 13, 13),
('test@aol.com', '2023-06-14 23:45:00', 14, 14),
('test@aol.com', '2023-06-15 01:00:00', 15, 15),
('test@aol.com', '2023-06-16 02:15:00', 16, 16),
('user', '2023-06-04 16:20:00', 5, 17);
EOF

echo "Sample data has been inserted into the progress table."