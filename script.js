$(document).ready(function () {
    $(".button-flip").on("click", function() {
        let transform = $(".flex-cards").css("transform");
        console.log(transform);
        // $(".flex-cards").css("transform", "rotateY(180deg)");
        if (transform === "matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)" || transform == undefined)  {
            $(".flex-cards").css("transform", "rotateY(0deg)");
        } else {
            $(".flex-cards").css("transform", "rotateY(180deg)");
        }
    })
    // Array to store flashcard data: [Japanese, English, Romaji]
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

    let lastShownIndices = [];

    function getNextFlashcard() {
        const now = Date.now();
        let candidates = flashcards.map((card, index) => ({
            card,
            index,
            lastShown: lastShownIndices.findIndex(item => item.index === index),
            score: 0
        }));

        candidates.forEach(candidate => {
            if (candidate.lastShown === -1) {
                candidate.score = Infinity;
            } else {
                const daysElapsed = (now - lastShownIndices[candidate.lastShown].timestamp) / (1000 * 60 * 60 * 24);
                candidate.score = Math.pow(2, candidate.lastShown) * daysElapsed;
            }
        });

        candidates.sort((a, b) => b.score - a.score);
        // const selectedCard = candidates[0];
        // Find all candidates with the highest score
        const highestScore = candidates[0].score;
        const topCandidates = candidates.filter(c => c.score === highestScore);
        
        // Select a random candidate from the top candidates
        const selectedCard = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        
        lastShownIndices = lastShownIndices.filter(item => item.index !== selectedCard.index);
        lastShownIndices.unshift({ index: selectedCard.index, timestamp: now });

        if (lastShownIndices.length > flashcards.length) {
            lastShownIndices.pop();
        }
        // Check if all cards have been reviewed
        if (lastShownIndices.length === flashcards.length) {
            console.log("All cards have been reviewed!");
            // Make a call to the /save_progress post endpoint
            $.ajax({
                url: '/save_progress',
                type: 'POST',
                data: JSON.stringify({ lastShownIndices: lastShownIndices }),
                contentType: 'application/json',
                success: function(response) {
                    console.log('Progress saved successfully');
                },
                error: function(xhr, status, error) {
                    console.error('Error saving progress:', error);
                }
            });
            // Display a message to the user
            alert("Congratulations! You've reviewed all the flashcards.");
        }

        return selectedCard.card;
    }

    function updateFlashcard() {
        const [japanese, english, romaji] = getNextFlashcard();
        console.log(romaji);
        $("#japanese-text").text(japanese);
        $("#romanji-text").text(romaji);
        $('#phonetic-text').text(romaji);
        $("#english-text").text(english);
    }

    // Initial flashcard update
    updateFlashcard();

    // Update flashcard when the "Next" button is clicked
    $(".button-next").on("click", updateFlashcard);
    
    
    // Add touch event listeners for swipe detection using jQuery
    let touchStartX = 0;
    let touchEndX = 0;
    
    $(document).on('touchstart', function(event) {
        touchStartX = event.originalEvent.touches[0].screenX;
    });
    
    $(document).on('touchend', function(event) {
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


    const modal = $("#word-list-modal");
    const btn = $("#open-word-list");
    const span = $(".close");

    btn.click(function() {
        modal.css("display", "block");
        populateWordList();
    });

    span.click(function() {
        modal.css("display", "none");
    });

    $(window).click(function(event) {
        if (event.target == modal[0]) {
            modal.css("display", "none");
        }
    });

    function populateWordList() {
        const wordList = $("#word-list");
        wordList.empty(); // Clear existing items

        // Add your word list here

        flashcards.forEach(word => {
            wordList.append(`<li>${word[0]} - ${word[1]} - ${word[2]}</li>`);
        });
    }
});
