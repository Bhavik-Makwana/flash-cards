// const API = "https://api.jpn-tourist-flashcards.com/api/v1";
const API = "http://localhost:8080/api/v1";

// Function to update the pie chart (call this when you have the data)
function updatePieChart(data) {
    const chart = Chart.getChart('category-pie-chart');
    if (chart) {
        chart.data.datasets[0].data = data;
        chart.update();
    }
}

// This script will be replaced with actual data fetching and processing
// For now, it's just a placeholder to show how the progress bars might work
function updateProgress(category, progress, mastered, seen, total) {
    $(`#${category}-progress`).css('width', `${progress}%`);
    $(`#${category}-mastered`).text(mastered);
    $(`#${category}-seen`).text(seen);
    $(`#${category}-total`).text(total);
    updateProgressBar(category);
}

// Function to fetch progress data from the server
function fetchProgressData(category) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${API}/progress`,
            method: 'GET',
            data: { category: category },
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching progress data:', error);
                reject(error);
            }
        });
    });
}

// Function to fetch words for a specific category
function fetchWordsByCategory(category) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${API}/words/category`,
            method: 'GET',
            data: { category: category },
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching words for category:', category, error);
                reject(error);
            }
        });
    });
}

// Function to process the received progress data
async function processProgressData(data) {
    if (data && data.progress) {
        try {
            const totalWords = await fetchWordsByCategory(data.category);
            let seenWords = 0;
            let masteredWords = 0;
            let masteredWordsList = [];
            let seenWordsList = [];

            data.progress.forEach(word => {
                if (word.seen_count > 0) {
                    seenWords++;
                    seenWordsList.push(`${word.english} | ${word.japanese} | ${word.romanji}`);
                }
                if (word.correct_count / word.seen_count >= 0.8) {
                    masteredWords++;
                    masteredWordsList.push(`${word.english} | ${word.japanese} | ${word.romanji}`);
                }
            });

            const progressPercentage = (masteredWords / totalWords.length) * 100;

            // Populate word list
            populateWordList(data.category.toLowerCase(), masteredWordsList.concat(seenWordsList));
            updateProgress(data.category.toLowerCase(), progressPercentage, masteredWords, seenWords, totalWords.length);
            return {
                category: data.category.toLowerCase(),
                progress: progressPercentage,
                masteredWords: masteredWords,
                seenWords: seenWords,
                totalWords: totalWords.length
            };
        } catch (error) {
            console.error('Error processing progress data:', error);
            return null;
        }
    }
    return null;
}

// Call fetchProgressData for each category when the page loads
$(document).ready(function () {

});


// Function to update progress bar and change color if 100%
function updateProgressBar(category) {
    const progressBar = $(`#${category}-progress`);
    // Get the current width value as a percentage
    const currentWidth = (progressBar.width() / progressBar.parent().width()) * 100;
    // Log the width for debugging purposes
    // console.log(`Current width of ${category} progress bar: ${currentWidth.toFixed(2)}%`);
    if (currentWidth === 100) {
        progressBar.css('background-color', '#4CAF50'); // Green color
    } else if (currentWidth >= 50 && currentWidth < 100) {
        progressBar.css('background-color', '#FFD700'); // Gold color
    } else {

        progressBar.css('background-color', ''); // Reset to default color
    }
}


// Function to toggle word list visibility
function toggleWordList(category) {
    const wordList = $(`#${category}-word-list`);
    const header = wordList.prev('.category-header');
    const toggleIcon = header.find('.toggle-icon');

    if (wordList.hasClass('expanded')) {
        wordList.removeClass('expanded');
        wordList.slideUp(300);
        toggleIcon.html('&#9660;'); // Down arrow
    } else {
        wordList.addClass('expanded');
        wordList.slideDown(300);
        toggleIcon.html('&#9650;'); // Up arrow
    }
}



// Function to populate word lists (to be implemented with actual data)
function populateWordList(category, words) {
    const wordList = $(`#${category}-word-list`);
    wordList.empty(); // Clear existing content

    words.forEach(word => {
        const wordElement = $('<div>').addClass('word-item').text(word);
        wordList.append(wordElement);
    });
}

// Function to calculate and update total words practiced
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


// Function to update the words mastered count for a specific category
function updateWordsMasteredCount(wordsMasteredByCategory, categoryIndex, masteredCount) {
    wordsMasteredByCategory[categoryIndex] = masteredCount;
}

$(document).ready(function () {
    window.toggleWordList = toggleWordList;
    // Example usage (replace with actual data fetching):


    const categories = ['Essentials', 'Emergency', 'Shopping', 'Time', 'Dining', 'Travel', 'Hotel', 'Culture', 'Photography'];

    let wordsMasteredByCategory = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let fetchPromises = categories.map(category =>
        fetchProgressData(category)
            .then(data => processProgressData(data))
    );

    Promise.all(fetchPromises)
        .then((processedData) => {
            console.log("All category data fetched and processed");
            updateTotalWordsPracticed(processedData);
            processedData.forEach((data, index) => {
                if (data && data.masteredWords !== undefined) {
                    updateWordsMasteredCount(wordsMasteredByCategory, index, data.masteredWords);
                }
            });
            const ctx = $('#category-pie-chart')[0].getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Essentials', 'Emergency', 'Shopping', 'Time', 'Dining', 'Travel', 'Hotel', 'Culture', 'Photography'],
                    datasets: [{
                        data: wordsMasteredByCategory, // Initialize with zeros, update dynamically
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                            '#FF9F40', '#FF6384', '#C9CBCF', '#7CFC00'
                        ]
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        title: {
                            display: true,
                            text: 'Words Mastered by Category'
                        },
                    },
                    responsive: true,
                    legend: {
                        display: false,
                        position: 'top',
                        align: 'left'
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error fetching category data:", error);
        });





});
