document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const treeCount = document.getElementById('treeCount');
    const co2Count = document.getElementById('co2Count');

    // Simulated eco-stats animation
    let trees = 0;
    let co2 = 0;
    const maxTrees = 50;
    const maxCO2 = 1000;

    function animateStats() {
        if (trees < maxTrees) {
            trees += Math.floor(Math.random() * 5);
            if (trees > maxTrees) trees = maxTrees;
            treeCount.textContent = `Trees Saved: ${trees}`;
        }
        if (co2 < maxCO2) {
            co2 += Math.floor(Math.random() * 50);
            if (co2 > maxCO2) co2 = maxCO2;
            co2Count.textContent = `CO2 Reduced: ${co2} kg`;
        }
        if (trees < maxTrees || co2 < maxCO2) {
            requestAnimationFrame(animateStats);
        }
    }

    // Start animation on load
    setTimeout(animateStats, 500);

    // Start button click
    startBtn.addEventListener('click', () => {
        const username = localStorage.getItem('loggedInUser');
        if (username) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
    });

    // Particle effect on hover
    startBtn.addEventListener('mouseover', () => {
        createParticles(startBtn);
    });

    function createParticles(element) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.position = 'absolute';
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.background = '#4caf50';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';

            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            document.body.appendChild(particle);

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 50 + 50;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;

            let opacity = 1;
            function animateParticle() {
                const newX = parseFloat(particle.style.left) + dx * 0.02;
                const newY = parseFloat(particle.style.top) + dy * 0.02;
                opacity -= 0.02;

                particle.style.left = `${newX}px`;
                particle.style.top = `${newY}px`;
                particle.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                }
            }
            animateParticle();
        }
    }
});