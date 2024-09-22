// const API = "https://api.jpn-tourist-flashcards.com/api/v1";
const API = "http://localhost:8080/api/v1";
// login
$(document).ready(function () {
    
        $(".login-button-submit").on("click", function () {
            // Prevent the default button behavior
            event.preventDefault();
            // Make a call to localhost:8080/login
            let data = {
                username: $('#email').val(),
                password: $('#password').val()
            };
            console.log(data);
            $.ajax({
                url: `${API}/login`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                // xhrFields: {
                //     withCredentials: true
                // },
                success: function (response) {
                    localStorage.setItem('token', response.token);
    
                    // Handle successful login here
                    // For example, redirect to a new page or update UI
                    // Redirect to cards.html after successful login
                    window.location.href = 'cards.html';
                },
                error: function (xhr, status, error) {
                    alert('Login failed:', error);
                    if (xhr.status === 0) {
                        console.error("CORS error: The request was blocked by the CORS policy");
                    } else {
                        console.error('Login failed:', error);
                    }
                    // Handle login error here
                    // For example, show an error message to the user
                }
            });
        })
    
    
    
        $(".signup-button-submit").on("click", function () {
            event.preventDefault();
            let data = {
                name: $('#name').val(),
                username: $('#email').val(),
                password: $('#password').val()
            };
            console.log(data);
            $.ajax({
                url: `${API}/signup`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(data),
                xhrFields: {
                    withCredentials: true
                },
                success: function (response) {
                    console.log('Signup successful:', response);
                    localStorage.setItem('token', response.token);
                    window.location.href = 'cards.html';
                },
                error: function (xhr, status, error) {
                    console.error('Signup failed:', error);
                }
            });
        });

    
});
