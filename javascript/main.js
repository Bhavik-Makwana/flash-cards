import { generateNavBar, initHamburgerMenu } from './navBar.js';
import { initializeFlashcards } from './flashcards.js';
import { initializeWordList } from './wordList.js';
import { initUIInteractions } from './uiInteractions.js';
import { getFlashcards } from './flashcards.js';
import { fetchWordList } from './wordList.js';
$(document).ready(function () {
    const API = "https://api.jpn-tourist-flashcards.com/api/v1";
    const LOCAL_API = "http://localhost:8080/api/v1";

    $('#essentials-category').css('background-color', '#1b9b88');
    fetchWordList('Essentials');
    generateNavBar();
    initializeWordList(getFlashcards());
    initUIInteractions();
    initHamburgerMenu();
});