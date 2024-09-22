import { setCurrentWordIndex } from "./uiInteractions.js";

// Array to store flashcard data: [Japanese, English, Romanji]
let flashcards = [
    // ["こんにちは", "Hello", "Konnichiwa"],
    // ["ありがとう", "Thank you", "Arigatou"],
    // ["すみません", "Excuse me", "Sumimasen"],
    // ["おはよう", "Good morning", "Ohayou"],
    // ["どこですか", "Where is it?", "Doko desu ka"],
    // ["いくらですか", "How much is it?", "Ikura desu ka"],
    // ["おいしいです", "It's delicious", "Oishii desu"],
    // ["トイレはどこですか", "Where is the bathroom?", "Toire wa doko desu ka"],
    // ["英語を話せますか", "Do you speak English?", "Eigo wo hanasemasu ka"],
    // ["水をください", "Water please", "Mizu wo kudasai"],
    // ["駅はどこですか", "Where is the station?", "Eki wa doko desu ka"],
    // ["助けてください", "Help me please", "Tasukete kudasai"],
    // ["わかりません", "I don't understand", "Wakarimasen"],
    // ["もう一度お願いします", "One more time please", "Mou ichido onegaishimasu"]
    // Add more flashcards here
];

let audio = new Audio();
export function getAudio() {
    return audio;
}
export function setAudio(newAudio) {
    audio = newAudio;
}

export function getFlashcards() {
    return flashcards;
}

export function setFlashcards(newFlashcards) {
    flashcards = newFlashcards;
}

let lastShownIndices = [];
export function initializeFlashcards(flashcards) {
    updateFlashcard(flashcards, 0);
}

export function getNextFlashcard(flashcards, currentWordIndex) {
    if (currentWordIndex >= flashcards.length) {
        setCurrentWordIndex(0);
        console.log("All cards have been reviewed!");
        // Make a call to the /save_progress post endpoint
        $.ajax({
            url: '/save_progress',
            type: 'POST',
            data: JSON.stringify({ lastReviewedIndex: flashcards.length - 1 }),
            contentType: 'application/json',
            success: function (response) {
                console.log('Progress saved successfully');
            },
            error: function (xhr, status, error) {
                console.error('Error saving progress:', error);
            }
        });
        // Display a message to the user
        alert("Congratulations! You've reviewed all the flashcards.");
    }
    console.log("b", flashcards);
    const selectedCard = flashcards[currentWordIndex];
    // currentWordIndex++;
    console.log(selectedCard);
    return selectedCard;
}

export function updateFlashcard(flashcards, currentWordIndex) {
    const flashcard = getNextFlashcard(flashcards, currentWordIndex);
    $("#japanese-text").text(flashcard.japanese);
    $("#romanji-text").text(flashcard.romanji);
    $('#phonetic-text').text(flashcard.romanji);
    $("#english-text").text(flashcard.english);
    audio = new Audio(`/assets/audio/${flashcard.category.toLowerCase()}/${flashcard.audio_url}`);
    console.log(audio);
    // $('#word-list li').forEach(li => li.classList.remove('current'));
    // document.getElementById(`word-${card.id}`).classList.add('current');
}