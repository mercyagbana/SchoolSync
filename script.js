//Schoolsync admin login

// Admin login details
const adminUsername = "admin";
const adminPassword = "1234";


// Get the login form
const loginForm = document.getElementById("loginForm");


// Listen for form submission
loginForm.addEventListener("submit", function (event) {

    // Stop the page from refreshing
    event.preventDefault();


    // Get the values entered by the user
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const loginMessage = document.getElementById("loginMessage");


    // Check the username and password
    if (username === adminUsername && password === adminPassword) {

        // Successful login
        loginMessage.textContent = "Login successful. loading...";
        loginMessage.style.color = "#16a34a";


        // Save login status
        localStorage.setItem("schoolSyncLoggedIn", "true");


        // Send user to dashboard
        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 800);

    } else {

        // Incorrect login
        loginMessage.textContent = "Invalid username or password.";
        loginMessage.style.color = "#dc2626";

    }

});