document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const itemsDiv = document.getElementById('items');
    const scoreDisplay = document.getElementById('score');
    const rewardPointsDisplay = document.getElementById('rewardPoints');
    const highScoreDisplay = document.getElementById('highScore');
    const gameOverDiv = document.getElementById('gameOver');
    const finalScoreDisplay = document.getElementById('finalScore');
    const finalRewardPointsDisplay = document.getElementById('finalRewardPoints');
    const restartBtn = document.getElementById('restartBtn');
    const homeBtn = document.getElementById('homeBtn');
    const gameArea = document.getElementById('gameArea');

    let score = 0;
    let rewardPoints = 0;
    let highScore = localStorage.getItem('ecoRunHighScore') || 0;
    highScoreDisplay.textContent = highScore;
    let isJumping = false;
    let gameActive = false;
    let items = [];
    let lastFrameTime = 0;
    let baseSpeed = 6;
    let speed = baseSpeed;
    let lastPollutionSpawn = 0;
    let lastEcoSpawn = 0;
    let lastSpeedIncrease = 0;
    const speedIncreaseInterval = 10000; // 10 seconds
    const speedIncrement = 1; // Increase speed by 1 every 10 seconds
    const minPollutionInterval = 1500;
    const maxPollutionInterval = 3000;
    const ecoSpawnInterval = 4000;
    let lastTouchTime = 0;
    const touchCooldown = 200;

    const username = localStorage.getItem('loggedInUser');
    let users = JSON.parse(localStorage.getItem('users')) || {};

    function startGame() {
        score = 0;
        rewardPoints = 0;
        speed = baseSpeed;
        scoreDisplay.textContent = score;
        rewardPointsDisplay.textContent = rewardPoints;
        gameOverDiv.classList.add('hidden');
        document.getElementById('intro').classList.remove('hidden');
        itemsDiv.innerHTML = '';
        items = [];
        gameActive = true;
        lastFrameTime = performance.now();
        lastPollutionSpawn = 0;
        lastEcoSpawn = 0;
        lastSpeedIncrease = lastFrameTime;
        player.style.bottom = '5px';
        player.style.left = '15px';
        gameLoop(lastFrameTime);
    }

    function jump() {
        if (!isJumping && gameActive) {
            isJumping = true;
            player.classList.add('jump');
            setTimeout(() => {
                player.classList.remove('jump');
                isJumping = false;
            }, 400);
        }
    }

    function spawnPollution(timestamp) {
        const spawnInterval = Math.max(minPollutionInterval, maxPollutionInterval - (score / 10));
        if (timestamp - lastPollutionSpawn < spawnInterval) return;

        const item = document.createElement('div');
        item.classList.add('item', 'pollution');
        item.style.left = `${gameArea.offsetWidth}px`;
        itemsDiv.appendChild(item);
        items.push({ element: item, type: 'pollution' });
        lastPollutionSpawn = timestamp;
    }

    function spawnEcoItem(timestamp) {
        if (timestamp - lastEcoSpawn < ecoSpawnInterval) return;

        const item = document.createElement('div');
        item.classList.add('item');
        const type = Math.random() < 0.5 ? 'tree' : 'water';
        item.classList.add(type);
        item.style.left = `${gameArea.offsetWidth}px`;
        itemsDiv.appendChild(item);
        items.push({ element: item, type: 'eco' });
        lastEcoSpawn = timestamp;
    }

    function gameLoop(timestamp) {
        if (!gameActive) return;

        const deltaTime = (timestamp - lastFrameTime) / 16.67;
        lastFrameTime = timestamp;

        // Increase speed every 10 seconds
        if (timestamp - lastSpeedIncrease >= speedIncreaseInterval) {
            speed += speedIncrement;
            lastSpeedIncrease = timestamp;
        }

        spawnPollution(timestamp);
        spawnEcoItem(timestamp);

        score = Math.floor((timestamp - (lastFrameTime - deltaTime * 16.67)) / 100);
        scoreDisplay.textContent = score;

        items.forEach((item, index) => {
            let left = parseFloat(item.element.style.left) - speed * deltaTime;
            item.element.style.left = `${left}px`;

            const playerRect = player.getBoundingClientRect();
            const itemRect = item.element.getBoundingClientRect();

            if (
                playerRect.left + 10 < itemRect.right &&
                playerRect.right - 10 > itemRect.left &&
                playerRect.bottom - 10 > itemRect.top &&
                playerRect.top + 10 < itemRect.bottom
            ) {
                if (item.type === 'pollution') {
                    endGame();
                    return;
                } else if (item.type === 'eco') {
                    rewardPoints += 50;
                    rewardPointsDisplay.textContent = rewardPoints;
                    item.element.remove();
                    items.splice(index, 1);
                }
            }

            if (left < -40) {
                item.element.remove();
                items.splice(index, 1);
            }
        });

        requestAnimationFrame(gameLoop);
    }

    function endGame() {
        gameActive = false;
        finalScoreDisplay.textContent = score;
        finalRewardPointsDisplay.textContent = rewardPoints;
        gameOverDiv.classList.remove('hidden');
        document.getElementById('intro').classList.add('hidden');

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('ecoRunHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }

        if (username && users[username]) {
            users[username].points += rewardPoints;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            jump();
        }
    });

    gameArea.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const currentTime = Date.now();
        if (currentTime - lastTouchTime >= touchCooldown) {
            jump();
            lastTouchTime = currentTime;
        }
    }, { passive: false });

    restartBtn.addEventListener('click', startGame);

    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    startGame();
});