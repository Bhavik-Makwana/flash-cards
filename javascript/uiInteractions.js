import { updateWordStatus } from './wordList.js';
import { getFlashcards, setFlashcards } from './flashcards.js';
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

// Add click event listeners for category buttons
$('.categories .flex-deck').on('click', function () {
    const categoryId = $(this).attr('id');
    const categoryName = $(this).text().trim();
    // alert(`You clicked on the ${categoryName} category!`);

    // Here you can add additional functionality,
    // such as fetching flashcards for the selected category
    fetchWordList(categoryName);
});




// cards
$(".button-flip").on("click", function () {
    let transform = $(".flex-cards").css("transform");
    console.log(transform);
    // $(".flex-cards").css("transform", "rotateY(180deg)");
    if (transform === "matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)" || transform == undefined) {
        $(".flex-cards").css("transform", "rotateY(0deg)");
    } else {
        $(".flex-cards").css("transform", "rotateY(180deg)");
    }
})


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