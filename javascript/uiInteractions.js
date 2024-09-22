import { updateWordStatus } from './wordList.js';
import { getFlashcards, setFlashcards, getAudio, setAudio } from './flashcards.js';
import { updateFlashcard } from './flashcards.js';
import { fetchWordList } from './wordList.js';
// Add click event listener to flip-container
$('.flip-container').on('click', function () {
    $(this).toggleClass('flipped');
});



let currentWordIndex = 0;

export function setCurrentWordIndex(index) {
    currentWordIndex = index;
}

// Add click event listener for audio button
$('.audio-button').on('click', function() {
    event.stopPropagation(); // Prevent the click event from bubbling up to the flip-container
    const audio = getAudio();
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
});

// Add click event listeners for category buttons
$('.categories .flex-deck').on('click', function () {
    const categoryId = $(this).attr('id');
    const categoryName = $(this).text().trim();

    // Remove highlight from all categories
    $('.categories .flex-deck').css('background-color', '');

    // Highlight the clicked category
    $(this).css('background-color', '#1b9b88');

    // Fetch flashcards for the selected category
    fetchWordList(categoryName);
});


// Modify your button click handlers
$(".button-correct").on("click", function () {
    // $(`#word-${currentWordIndex}`).removeClass('incorrect').addClass('correct');
    updateWordStatus(currentWordIndex, 'correct');
    currentWordIndex = moveToNextWord(currentWordIndex, getFlashcards());
});

$(".button-incorrect").on("click", function () {
    // $(`#word-${currentWordIndex}`).removeClass('correct').addClass('incorrect');
    updateWordStatus(currentWordIndex, 'incorrect');
    currentWordIndex = moveToNextWord(currentWordIndex, getFlashcards());
});

function moveToNextWord(currentWordIndex, flashcards) {
    currentWordIndex = (currentWordIndex + 1) % (flashcards.length + 1);
    console.log(currentWordIndex, flashcards.length);
    updateFlashcard(flashcards, currentWordIndex);
    return currentWordIndex;
}




// Add touch event listeners for swipe detection using jQuery
function initSwipeGesture() {
    let touchstartX = 0;
    let touchendX = 0;

    const gestureZone = document.getElementsByClassName('flip-container');

    $(document).on('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    $(document).on('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchendX < touchstartX) {
            // Swipe left, go to next card
            nextCard();
        }
        if (touchendX > touchstartX) {
            // Swipe right, go to previous card (if implemented)
            // previousCard();
        }
    }
}



export function initUIInteractions() {
    initSwipeGesture();
}