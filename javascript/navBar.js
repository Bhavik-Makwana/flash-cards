export function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

export function generateNavBar() {
    const $navLinks = $('.nav-links');
    $navLinks.empty();

    if (!isUserLoggedIn()) {
        $navLinks.append(`
            <li><a href="#start"><button class="start-button">Get Started</button></a></li>
            <li><a href="progress.html"><button class="progress-button">Progress</button></a></li>
            <li><a href="login.html"><button class="login-button">Login</button></a></li>
        `);
    } else {
        $navLinks.append(`
            <li><a href="cards.html"><button class="start-button">Flashcards</button></a></li>
            <li><a href="progress.html"><button class="progress-button">Progress</button></a></li>
            <li><a href="profile.html"><button class="login-button">Profile</button></a></li>
        `);
    }
}

export function initHamburgerMenu() {
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

    initCloseButton();
    toggleCloseButton();
    addEventListeners();
}