const API = "https://api.jpn-tourist-flashcards.com/api/v1";
const LOCAL_API = "http://localhost:8080/api/v1";

import { login } from './login.js';
$(document).ready(function () {

    // Function to check if user is logged in
    function isUserLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    // Function to generate nav bar components
    function generateNavBar() {
        const $navLinks = $('.nav-links');
        $navLinks.empty(); // Clear existing links

        if (!isUserLoggedIn()) {
            // User is not logged in, add appropriate buttons
            $navLinks.append(`
                <li><a href="#start"><button class="start-button">Get Started</button></a></li>
                <li><a href="login.html"><button class="login-button">Login</button></a></li>
                <li><a href="progress.html"><button class="progress-button">Progress</button></a></li>
            `);
        } else {
            // User is logged in, you can add different buttons here if needed
            // For example:
            $navLinks.append(`
                <li><a href="cards.html"><button class="start-button">Flashcards</button></a></li>
                <li><a href="progress.html"><button class="progress-button">Progress</button></a></li>
                <li><a href="profile.html"><button class="login-button">Profile</button></a></li>
            `);
        }
    }

    // Call the function to generate nav bar
    generateNavBar();

    
    // Add click event listener to flip-container
    $('.flip-container').on('click', function() {
        $(this).toggleClass('flipped');
    });

    // Array to store flashcard data: [Japanese, English, Romanji]
    const flashcards = [
        ["こんにちは", "Hello", "Konnichiwa"],
        ["ありがとう", "Thank you", "Arigatou"],
        ["すみません", "Excuse me", "Sumimasen"],
        ["おはよう", "Good morning", "Ohayou"],
        ["どこですか", "Where is it?", "Doko desu ka"],
        ["いくらですか", "How much is it?", "Ikura desu ka"],
        ["おいしいです", "It's delicious", "Oishii desu"],
        ["トイレはどこですか", "Where is the bathroom?", "Toire wa doko desu ka"],
        ["英語を話せますか", "Do you speak English?", "Eigo wo hanasemasu ka"],
        ["水をください", "Water please", "Mizu wo kudasai"],
        ["駅はどこですか", "Where is the station?", "Eki wa doko desu ka"],
        ["助けてください", "Help me please", "Tasukete kudasai"],
        ["わかりません", "I don't understand", "Wakarimasen"],
        ["もう一度お願いします", "One more time please", "Mou ichido onegaishimasu"]
        // Add more flashcards here
    ];

    // Add these variables at the top of your script
    let currentWordIndex = 0;
    let wordStatuses = {};



    // Function to initialize the word list
    function initializeWordList() {
        const $wordList = $('#word-list');
        $.each(flashcards, function (index, card) {
            const $li = $('<li>', {
                text: `${card[0]} - ${card[1]} - ${card[2]}`,  // Assuming Japanese text is the first element
                id: `word-${index}`
            });
            $wordList.append($li);

        });
    }

    // Modify your updateFlashcard function
    function updateFlashcard() {
        const card = flashcards[currentWordIndex];
        $("#japanese-text").text(card.japanese);
        $("#romanji-text").text(card.romanji);
        $('#phonetic-text').text(card.romanji);
        $("#english-text").text(card.english);

        // Highlight the current word in the list

    }


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


    let lastShownIndices = [];

    function getNextFlashcard() {
        console.log(currentWordIndex, flashcards.length);
        if (currentWordIndex >= flashcards.length) {
            currentWordIndex = 0;
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

        const selectedCard = flashcards[currentWordIndex];
        // currentWordIndex++;

        return selectedCard;
    }

    function updateFlashcard() {
        const [japanese, english, romanji] = getNextFlashcard();
        console.log(romanji);
        $("#japanese-text").text(japanese);
        $("#romanji-text").text(romanji);
        $('#phonetic-text').text(romanji);
        $("#english-text").text(english);
        // $('#word-list li').forEach(li => li.classList.remove('current'));
        // document.getElementById(`word-${card.id}`).classList.add('current');
    }

    // Initial flashcard update
    updateFlashcard();

    // Modify your button click handlers
    $(".button-correct").on("click", function () {
        // $(`#word-${currentWordIndex}`).removeClass('incorrect').addClass('correct');
        updateWordStatus(currentWordIndex, 'correct');
        moveToNextWord();
    });

    $(".button-incorrect").on("click", function () {
        // $(`#word-${currentWordIndex}`).removeClass('correct').addClass('incorrect');
        updateWordStatus(currentWordIndex, 'incorrect');
        moveToNextWord();
    });

    function moveToNextWord() {
        currentWordIndex = (currentWordIndex + 1) % (flashcards.length+1);
        updateFlashcard();
    }

    function updateWordStatus(wordId, status) {
        console.log(wordId);
        const wordElement = document.getElementById(`word-${wordId}`);
        wordElement.classList.remove('correct', 'incorrect');
        wordElement.classList.add(status);
    }



    // Add touch event listeners for swipe detection using jQuery
    let touchStartX = 0;
    let touchEndX = 0;

    $(document).on('touchstart', function (event) {
        touchStartX = event.originalEvent.touches[0].screenX;
    });

    $(document).on('touchend', function (event) {
        touchEndX = event.originalEvent.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 100; // Minimum distance for a swipe
        if (Math.abs(touchStartX - touchEndX) > swipeThreshold) {
            // Swipe detected (left or right)
            let transform = $(".flex-cards").css("transform");
            console.log(transform);
            if (touchEndX < touchStartX) {
                // Swipe left
                $(".flex-cards").css("transform", "rotateY(180deg)");
            } else {
                // Swipe right
                $(".flex-cards").css("transform", "rotateY(0deg)");
            }
        }

    }


    // Hamburger menu
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const closeButton = document.createElement('button');

    function toggleMenu() {
        navLinks.classList.toggle('active');
    }

    function closeMenu() {
        navLinks.classList.remove('active');
    }

    function isHamburgerMenuDisplayed() {
        return window.getComputedStyle(hamburger).display !== 'none';
    }

    function toggleCloseButton() {
        closeButton.style.display = isHamburgerMenuDisplayed() ? 'block' : 'none';
    }

    function initCloseButton() {
        closeButton.textContent = 'X';
        closeButton.classList.add('close-button');
        navLinks.appendChild(closeButton);
    }

    function addEventListeners() {
        hamburger.addEventListener('click', toggleMenu);

        document.addEventListener('click', (event) => {
            if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
                closeMenu();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        closeButton.addEventListener('click', closeMenu);

        window.addEventListener('resize', toggleCloseButton);
    }

    function init() {
        initCloseButton();
        toggleCloseButton();
        addEventListeners();
    }

    init();
    initializeWordList();
});
