document.addEventListener('DOMContentLoaded', () => {
    const usernameDisplay = document.getElementById('usernameDisplay');
    const pointsDisplay = document.getElementById('pointsDisplay');
    const calculatorBtn = document.getElementById('calculatorBtn');
    const recyclingBtn = document.getElementById('recyclingBtn');
    const waterBtn = document.getElementById('waterBtn');
    const storyBtn = document.getElementById('storyBtn');
    const ecoRunBtn = document.getElementById('ecoRunBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Load user data
    const username = localStorage.getItem('loggedInUser');
    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (username && users[username]) {
        usernameDisplay.textContent = username;
        pointsDisplay.textContent = users[username].points || 0;
    } else {
        usernameDisplay.textContent = 'Guest';
        pointsDisplay.textContent = '0';
    }

    // Button navigation
    calculatorBtn.addEventListener('click', () => {
        window.location.href = 'calculator.html';
    });

    recyclingBtn.addEventListener('click', () => {
        window.location.href = 'recycling-game.html';
    });

    waterBtn.addEventListener('click', () => {
        window.location.href = 'water-challenge.html';
    });

    storyBtn.addEventListener('click', () => {
        window.location.href = 'story-mode.html';
    });

    ecoRunBtn.addEventListener('click', () => {
        window.location.href = 'eco-run.html';
    });

    leaderboardBtn.addEventListener('click', () => {
        window.location.href = 'leaderboard.html';
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    });

    // Ripple effect on button click (mobile-friendly)
    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Ripple effect styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);