// Function to check if the user is logged in
function isLoggedIn() {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
        return true;
    }
    return false;
    // Validate the token with the backend
    // let isValid = false;
    // $.ajax({
    //     url: 'http://localhost:8080/authenticate_user',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //     },
    //     async: false,
    //     success: function(response) {
    //         isValid = true;
    //         console.log("isValid", isValid);
    //     },
    //     error: function(xhr, status, error) {
    //         console.error('Token validation failed:', error);
    //         // If validation fails, remove the invalid token
    //         // localStorage.removeItem('token');
    //     }
    // });

    // return isValid;
}
export { isLoggedIn };
