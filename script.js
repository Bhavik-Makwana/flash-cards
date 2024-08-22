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
});