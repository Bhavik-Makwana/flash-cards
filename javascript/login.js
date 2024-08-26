// login
function login() {
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
            url: 'http://138.68.136.155/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            success: function (response) {
                console.log('Login successful:', response);
                localStorage.setItem('token', response.token);

                // Handle successful login here
                // For example, redirect to a new page or update UI
                // Redirect to cards.html after successful login
                window.location.href = 'cards.html';
            },
            error: function (xhr, status, error) {
                console.error('Login failed:', error);
                // Handle login error here
                // For example, show an error message to the user
            }
        });
    })
}

export { login };