// const API = "https://api.jpn-tourist-flashcards.com/api/v1";
const API = "http://localhost:8080/api/v1";

function fetchUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found. User might not be logged in.');
        window.location.href = 'login.html';
        return;
    }
    console.log("token", token);
    $.ajax({
        url: `${API}/user`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        success: function(response) {
            updateProfileUI(response);
            console.log("response", response);
        },
        error: function(xhr, status, error) {
            console.error('Failed to fetch user info:', error);
            if (xhr.status === 401) {
                // Unauthorized, token might be expired
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        }
    });
}

function updateProfileUI(userInfo) {
    $('#user-name').text(userInfo.username);
    $('#user-email').text(userInfo.username);
    // Add more fields as needed, e.g.:
    // $('#name').text(userInfo.name);
    // $('#joinDate').text(new Date(userInfo.joinDate).toLocaleDateString());
}

function signOut() {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to the homepage
    window.location.href = 'index.html';
}


$(document).ready(function() {

    fetchUserInfo();
    $('#sign-out-button').on('click', function(event) {
        event.preventDefault();
        signOut();
    });
});
