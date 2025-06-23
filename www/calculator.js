document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions');
    const nextBtn = document.getElementById('nextBtn');
    const progress = document.getElementById('progress');
    const resultDiv = document.getElementById('result');
    const totalFootprintSpan = document.getElementById('totalFootprint');
    const categorySpan = document.getElementById('category');
    const pointsEarnedSpan = document.getElementById('pointsEarned');
    const pieChartCanvas = document.getElementById('pieChart');
    const chatbotDiv = document.getElementById('chatbot');
    const suggestionP = document.getElementById('suggestion');
    const homeBtn = document.getElementById('homeBtn');

    let currentStep = 0;
    let answers = {};
    let chart;

    const questions = [
        { id: 'travel', text: 'How many kilometers do you drive daily?', type: 'number', unit: 'km' },
        { id: 'food', text: 'How many meat meals do you eat daily?', type: 'options', options: [0, 1, 2, 3, 4] },
        { id: 'waste', text: 'How many kilograms of trash do you produce daily?', type: 'number', unit: 'kg' },
        { id: 'electricity', text: 'How many kWh of electricity do you use daily?', type: 'number', unit: 'kWh' },
        { id: 'fuel', text: 'How many liters of fuel do you use daily?', type: 'number', unit: 'liters' }
    ];

    function showQuestion(step) {
        container.innerHTML = '';
        const q = questions[step];
        const div = document.createElement('div');
        div.classList.add('question');
        
        const label = document.createElement('label');
        label.textContent = q.text;
        div.appendChild(label);

        if (q.type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.step = '0.1';
            input.placeholder = `e.g., 5 ${q.unit}`;
            input.id = q.id;
            div.appendChild(input);
        } else if (q.type === 'options') {
            const btnContainer = document.createElement('div');
            btnContainer.classList.add('option-buttons');
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.classList.add('option-btn');
                btn.textContent = opt;
                btn.addEventListener('click', () => {
                    btnContainer.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    answers[q.id] = opt;
                });
                btnContainer.appendChild(btn);
            });
            div.appendChild(btnContainer);
        }

        container.appendChild(div);
        progress.style.width = `${((step + 1) / questions.length) * 100}%`;
    }

    function calculateFootprint() {
        const travel = (parseFloat(answers.travel) || 0) * 0.25; // 0.25 kg CO2e per km
        const food = (parseFloat(answers.food) || 0) * 2.5; // 2.5 kg CO2e per meat meal
        const waste = (parseFloat(answers.waste) || 0) * 0.7; // 0.7 kg CO2e per kg
        const electricity = (parseFloat(answers.electricity) || 0) * 0.5; // 0.5 kg CO2e per kWh
        const fuel = (parseFloat(answers.fuel) || 0) * 2.3; // 2.3 kg CO2e per liter

        const total = travel + food + waste + electricity + fuel;
        let category, pointsEarned;
        if (total < 10) {
            category = 'Low';
            pointsEarned = 50; // Reward for low footprint
        } else if (total < 20) {
            category = 'Medium';
            pointsEarned = 20; // Moderate reward
        } else {
            category = 'High';
            pointsEarned = 0; // No reward for high footprint
        }

        // Update user-specific points
        const username = localStorage.getItem('loggedInUser');
        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (username && users[username]) {
            users[username].points += pointsEarned;
            localStorage.setItem('users', JSON.stringify(users));
        }

        totalFootprintSpan.textContent = total.toFixed(2);
        categorySpan.textContent = category;
        pointsEarnedSpan.textContent = pointsEarned;
        resultDiv.classList.remove('hidden');

        const data = {
            labels: ['Travel', 'Food', 'Waste', 'Electricity', 'Fuel'],
            datasets: [{
                data: [travel, food, waste, electricity, fuel],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'],
            }]
        };

        if (chart) chart.destroy();
        chart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Your Footprint Breakdown' }
                }
            }
        });

        let suggestions = [];
        if (travel > 5) suggestions.push('Try biking or public transport to cut travel emissions.');
        if (food > 5) suggestions.push('Reduce meat—maybe try a vegetarian day?');
        if (waste > 2) suggestions.push('Compost food scraps and recycle to lower waste.');
        if (electricity > 3) suggestions.push('Use energy-efficient appliances to save power.');
        if (fuel > 5) suggestions.push('Switch to cleaner fuel options or reduce usage.');

        suggestionP.textContent = suggestions.length > 0 
            ? suggestions.join(' ')
            : 'Awesome! Your footprint is low—keep it up!';
        chatbotDiv.classList.remove('hidden');
    }

    nextBtn.addEventListener('click', () => {
        if (currentStep < questions.length) {
            const q = questions[currentStep];
            if (q.type === 'number') {
                const input = document.getElementById(q.id);
                answers[q.id] = input.value || 0;
            } // Options handled via button clicks

            currentStep++;
            if (currentStep < questions.length) {
                showQuestion(currentStep);
            } else {
                container.classList.add('hidden');
                nextBtn.classList.add('hidden');
                document.getElementById('intro').classList.add('hidden');
                calculateFootprint();
            }
        }
    });

    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Start with the first question
    showQuestion(0);
});