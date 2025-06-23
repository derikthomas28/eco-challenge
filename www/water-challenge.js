document.addEventListener('DOMContentLoaded', () => {
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const water = document.getElementById('water');
    const stopBtn = document.getElementById('stopBtn');
    const resultDiv = document.getElementById('result');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartBtn = document.getElementById('restartBtn');
    const homeBtn = document.getElementById('homeBtn');

    let level = 1;
    const username = localStorage.getItem('loggedInUser');
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let score = username && users[username] ? users[username].points : 0; // Use unified points
    let waterLevel = 0;
    let fillSpeed = 0.5; // Initial speed (percent per frame)
    let gameActive = false;
    let animationFrame;

    function startLevel() {
        gameActive = true;
        waterLevel = 0;
        water.style.height = `${waterLevel}%`;
        levelDisplay.textContent = level;
        scoreDisplay.textContent = score;
        resultDiv.classList.add('hidden');
        stopBtn.disabled = false;
        fillSpeed = 0.5 + (level - 1) * 0.3; // Increase speed per level
        fillWater();
    }

    function fillWater() {
        if (!gameActive) return;

        waterLevel += fillSpeed;
        water.style.height = `${waterLevel}%`;

        if (waterLevel >= 100) {
            overflowPenalty();
            endGame();
        } else {
            animationFrame = requestAnimationFrame(fillWater);
        }
    }

    stopBtn.addEventListener('click', () => {
        if (!gameActive) return;

        gameActive = false;
        cancelAnimationFrame(animationFrame);
        score += Math.floor(100 - waterLevel); // Points for stopping (max 100)
        scoreDisplay.textContent = score;

        if (level < 5) { // Max 5 levels
            level++;
            setTimeout(startLevel, 1000); // 1-second pause before next level
        } else {
            endGame();
        }
    });

    function overflowPenalty() {
        score -= 50; // Negative points for overflow
        if (score < 0) score = 0; // Prevent negative total
        scoreDisplay.textContent = score;
    }

    function endGame() {
        gameActive = false;
        cancelAnimationFrame(animationFrame);
        stopBtn.disabled = true;
        finalScoreDisplay.textContent = score;
        resultDiv.classList.remove('hidden');
        if (username && users[username]) {
            users[username].points = score; // Update unified points
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    restartBtn.addEventListener('click', () => {
        level = 1;
        score = username && users[username] ? users[username].points : 0; // Reset to current unified points
        startLevel();
    });

    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Start the game
    startLevel();
});