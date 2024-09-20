// Modify this function to accept the processed data
async function processProgressData(data) {
    if (data && data.progress) {
        try {
            const totalWords = await fetchWordsByCategory(data.category);
            let seenWords = 0;
            let masteredWords = 0;
            // ... existing code ...

            // Return an object with the processed data
            return {
                category: data.category.toLowerCase(),
                seenWords,
                masteredWords,
                totalWords: totalWords.length
            };
        } catch (error) {
            console.error('Error processing progress data:', error);
            return null;
        }
    }
    return null;
}

// Update this function to use the processed data
function updateTotalWordsPracticed(processedData) {
    let totalWordsPracticed = 0;
    let totalCorrectAnswers = 0;

    processedData.forEach(data => {
        if (data) {
            totalWordsPracticed += data.seenWords;
            totalCorrectAnswers += data.masteredWords;
        }
    });

    console.log(`Total words practiced: ${totalWordsPracticed}`);
    $('#total-words-practiced').text(totalWordsPracticed);
    
    // Update accuracy rate
    const accuracyRate = totalWordsPracticed > 0 ? ((totalCorrectAnswers / totalWordsPracticed) * 100).toFixed(2) : 0;
    $('#accuracy-rate').text(`${accuracyRate}%`);
    $('#total-correct-answers').text(totalCorrectAnswers);
}

$(document).ready(function () {
    // ... existing code ...

    const categories = ['Essentials', 'Emergency', 'Shopping', 'Time', 'Dining', 'Travel', 'Hotel'];
        
    let fetchPromises = categories.map(category => 
        fetchProgressData(category)
            .then(data => processProgressData(data))
    );

    Promise.all(fetchPromises)
        .then((processedData) => {
            console.log("All category data fetched and processed");
            updateTotalWordsPracticed(processedData);
        })
        .catch(error => {
            console.error("Error fetching category data:", error);
        });

    // ... rest of the code ...
});