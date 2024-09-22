// Add these variables at the top of your script
import { initializeFlashcards, setFlashcards, getFlashcards } from './flashcards.js';
import { setCurrentWordIndex } from './uiInteractions.js';  
let wordStatuses = {};
const API = "https://api.jpn-tourist-flashcards.com/api/v1";
// const API = "http://localhost:8080/api/v1";

// Function to fetch word list for a category
export function fetchWordList(category) {
    console.log('Fetching word list for category:', category);
    $.ajax({
        url: `${API}/words/category`,
        method: 'GET',
        data: { category: category },
        success: function(response) {
            const $wordList = $('#word-list');
            $wordList.empty();
            $.each(response, function (index, card) {
                const $li = $('<li>', {
                    text: `${card.japanese} - ${card.english} - ${card.romanji}`,  // Assuming Japanese text is the first element
                    id: `word-${index}`
                });
                $wordList.append($li);
    
            });
            console.log(response);
            setCurrentWordIndex(0);
            setFlashcards(response);
            initializeFlashcards(getFlashcards());
        },
        error: function(xhr, status, error) {
            console.error('Error fetching word list:', error);
            alert('Error fetching word list:', error);
        }
    });
}



// Function to initialize the word list
export function initializeWordList(flashcards) {
    const $wordList = $('#word-list');
    $.each(flashcards, function (index, card) {
        const $li = $('<li>', {
            text: `${card[0]} - ${card[1]} - ${card[2]}`,  // Assuming Japanese text is the first element
            id: `word-${index}`
        });
        $wordList.append($li);

    });
}

export function updateWordStatus(wordId, status) {
    const wordElement = document.getElementById(`word-${wordId}`);
    wordElement.classList.remove('correct', 'incorrect');
    wordElement.classList.add(status);
}
