document.addEventListener('DOMContentLoaded', () => {
    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const errorMessage = document.getElementById('errorMessage');
    const signupError = document.getElementById('signupError');
    const homeBtn = document.getElementById('homeBtn');

    // Toggle between login and signup forms
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.classList.add('hidden');
        signupCard.classList.remove('hidden');
        errorMessage.style.display = 'none';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
        signupError.style.display = 'none';
    });

    // Login functionality
    loginBtn.addEventListener('click', () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username] && users[username].password === password) {
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password!';
            errorMessage.style.display = 'block';
        }
    });

    // Signup functionality
    signupBtn.addEventListener('click', () => {
        const newUsername = document.getElementById('newUsername').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (!newUsername || !newPassword) {
            signupError.textContent = 'Please fill in all fields!';
            signupError.style.display = 'block';
            return;
        }

        if (users[newUsername]) {
            signupError.textContent = 'Username already exists!';
            signupError.style.display = 'block';
        } else {
            users[newUsername] = { password: newPassword, points: 0 }; // Initialize with 0 points
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', newUsername);
            window.location.href = 'dashboard.html';
        }
    });

    // Home button redirect
    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});