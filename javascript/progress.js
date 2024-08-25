
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
function updateProgress(category, progress, mastered) {
    $(`#${category}-progress`).css('width', `${progress}%`);
    $(`#${category}-mastered`).text(mastered);
    updateProgressBar(category);
}



// Function to update progress bar and change color if 100%
function updateProgressBar(category) {
    const progressBar = $(`#${category}-progress`);
    // Get the current width value as a percentage
    const currentWidth = (progressBar.width() / progressBar.parent().width()) * 100;
    // Log the width for debugging purposes
    console.log(`Current width of ${category} progress bar: ${currentWidth.toFixed(2)}%`);
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




$(document).ready(function () {
    window.toggleWordList = toggleWordList;
    // Example usage (replace with actual data fetching):
    const essentialsWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const emergencyWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const shoppingWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const timeWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const diningWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const travelWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const hotelWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const cultureWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];
    const photographyWords = ['こんにちは', 'ありがとう', 'すみません', 'はい', 'いいえ'];

    populateWordList('essentials', essentialsWords);
    populateWordList('emergency', emergencyWords);
    populateWordList('shopping', shoppingWords);
    populateWordList('time', timeWords);
    populateWordList('dining', diningWords);
    populateWordList('travel', travelWords);
    populateWordList('hotel', hotelWords);
    populateWordList('culture', cultureWords);
    populateWordList('photography', photographyWords);

 
    const ctx = $('#category-pie-chart')[0].getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Essentials', 'Emergency', 'Shopping', 'Time', 'Dining', 'Travel', 'Hotel', 'Culture', 'Photography'],
            datasets: [{
                data: [1, 2, 3, 0, 0, 0, 0, 0, 0], // Initialize with zeros, update dynamically
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

    // Example usage:
    updateProgress('essentials', 75, 15);
    updateProgress('emergency', 50, 10);
    updateProgress('travel', 100, 100);
    updateProgress('time', 90, 100);
    updateProgress('dining', 0, 0);
    updateProgress('shopping', 0, 0);
    updateProgress('hotel', 10, 0);
    updateProgress('culture', 0, 0);
    updateProgress('photography', 0, 0);

    // Set up listeners for progress updates
    updateProgressBar('travel');

    updateProgress('travel', 100, 100);
    // Example usage:
    // $(document).trigger('progressUpdate', { category: 'essentials', progress: 100 });
    // Update overall stats
    $('#total-words-practiced').text('500');
    $('#total-correct-answers').text('400');
    $('#accuracy-rate').text('80%');

});
