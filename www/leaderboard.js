document.addEventListener('DOMContentLoaded', () => {
    const leaderboardList = document.getElementById('leaderboardList');
    const userPointsDisplay = document.getElementById('userPoints');
    const rewardsList = document.getElementById('rewardsList');
    const homeBtn = document.getElementById('homeBtn');

    const username = localStorage.getItem('loggedInUser');
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let userPoints = username && users[username] ? users[username].points : 0;
    userPointsDisplay.textContent = userPoints;

    let leaderboard = Object.entries(users).map(([name, data]) => ({
        name,
        points: data.points
    }));

    const rewards = [
        { name: '10% Off Coupon', points: 20, code: 'ECO10' },
        { name: 'Eco-Friendly Bag', points: 30, code: 'BAG2025' },
        { name: 'Free Coffee Voucher', points: 40, code: 'COFFEE25' }
    ];

    function updateLeaderboard() {
        leaderboardList.innerHTML = '';
        leaderboard.sort((a, b) => b.points - a.points);
        leaderboard.slice(0, 5).forEach((player, index) => { // Top 5
            const div = document.createElement('div');
            div.classList.add('leaderboard-item');
            div.innerHTML = `<span>#${index + 1} ${player.name}</span><span>${player.points} pts</span>`;
            leaderboardList.appendChild(div);
        });
    }

    function updateRewards() {
        rewardsList.innerHTML = '';
        rewards.forEach(reward => {
            const div = document.createElement('div');
            div.classList.add('reward-item');
            div.innerHTML = `
                <p>${reward.name}</p>
                <p>${reward.points} Points</p>
                <button ${userPoints < reward.points ? 'disabled' : ''}>Redeem</button>
            `;
            const button = div.querySelector('button');
            button.addEventListener('click', () => redeemReward(reward));
            rewardsList.appendChild(div);
        });
    }

    function redeemReward(reward) {
        if (userPoints >= reward.points) {
            userPoints -= reward.points;
            userPointsDisplay.textContent = userPoints;
            if (username && users[username]) {
                users[username].points = userPoints;
                localStorage.setItem('users', JSON.stringify(users));
            }
            alert(`Redeemed ${reward.name}! Use code: ${reward.code}`);
            updateRewards();
        }
    }

    updateLeaderboard();
    updateRewards();

    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});