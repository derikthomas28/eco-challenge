document.addEventListener('DOMContentLoaded', () => {
    const storyText = document.getElementById('storyText');
    const choicesDiv = document.getElementById('choices');
    const sceneNumber = document.getElementById('sceneNumber');
    const scoreDisplay = document.getElementById('score');
    const progress = document.getElementById('progress');
    const ecoFill = document.getElementById('ecoFill');
    const storyContainer = document.getElementById('story');
    const resultDiv = document.getElementById('result');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartBtn = document.getElementById('restartBtn');
    const homeBtn = document.getElementById('homeBtn');

    let currentScene = 0;
    let score = 0;
    const username = localStorage.getItem('loggedInUser');
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (username && users[username]) {
        score = users[username].points; // Load user's points
    }

    const scenes = [
        {
            text: "You wake up to a sunny morning. How do you start your day?",
            choices: [
                { text: "Make coffee with a reusable cup", points: 20 },
                { text: "Use a disposable coffee pod", points: -10 }
            ],
            bgColor: '#f1f8e9'
        },
        {
            text: "Time to get to work. How do you commute?",
            choices: [
                { text: "Ride a bike or walk", points: 30 },
                { text: "Drive alone in your car", points: -20 }
            ],
            bgColor: '#e8f5e9'
        },
        {
            text: "Lunchtime! What do you eat?",
            choices: [
                { text: "A vegetarian meal from home", points: 25 },
                { text: "Fast food with lots of packaging", points: -15 }
            ],
            bgColor: '#f0f8f0'
        },
        {
            text: "You’re shopping for groceries. How do you carry them?",
            choices: [
                { text: "Bring reusable bags", points: 20 },
                { text: "Take plastic bags from the store", points: -10 }
            ],
            bgColor: '#e0f2f1'
        },
        {
            text: "A friend invites you to a barbecue. What do you bring?",
            choices: [
                { text: "A plant-based dish to share", points: 25 },
                { text: "Pre-packaged meat burgers", points: -15 }
            ],
            bgColor: '#dcedc8'
        },
        {
            text: "Your town is hosting a recycling drive. Do you join?",
            choices: [
                { text: "Volunteer and sort recyclables", points: 35 },
                { text: "Skip it and stay home", points: 0 }
            ],
            bgColor: '#f1f8e9'
        },
        {
            text: "Evening plans: a light bulb burns out. What do you do?",
            choices: [
                { text: "Replace it with an LED bulb", points: 20 },
                { text: "Use an old incandescent bulb", points: -10 }
            ],
            bgColor: '#e8f5e9'
        },
        {
            text: "A storm hits, and a tree falls nearby. What’s your move?",
            choices: [
                { text: "Help replant trees with the community", points: 40 },
                { text: "Leave it to someone else", points: -5 }
            ],
            bgColor: '#f0f8f0'
        }
    ];

    function showScene() {
        if (currentScene >= scenes.length) {
            endStory();
            return;
        }

        const scene = scenes[currentScene];
        sceneNumber.textContent = currentScene + 1;
        scoreDisplay.textContent = score;
        storyText.textContent = scene.text;
        storyContainer.style.background = scene.bgColor;
        choicesDiv.innerHTML = '';
        progress.style.width = `${((currentScene + 1) / scenes.length) * 100}%`;

        // Update eco-meter based on score (max possible: 215, min: -85)
        const ecoPercentage = Math.max(0, Math.min(100, ((score + 85) / 300) * 100));
        ecoFill.style.width = `${ecoPercentage}%`;

        scene.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.classList.add('choice-btn');
            btn.textContent = choice.text;
            btn.addEventListener('click', () => makeChoice(choice.points));
            choicesDiv.appendChild(btn);
        });
    }

    function makeChoice(points) {
        score += points;
        if (score < 0) score = 0; // Prevent negative total
        currentScene++;
        showScene();
    }

    function endStory() {
        finalScoreDisplay.textContent = score;
        resultDiv.classList.remove('hidden');
        storyContainer.classList.add('hidden');
        document.getElementById('intro').classList.add('hidden');
        if (username && users[username]) {
            users[username].points = score;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    restartBtn.addEventListener('click', () => {
        currentScene = 0;
        if (username && users[username]) {
            score = users[username].points;
        }
        storyContainer.classList.remove('hidden');
        resultDiv.classList.add('hidden');
        document.getElementById('intro').classList.remove('hidden');
        showScene();
    });

    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Start the story
    showScene();
});