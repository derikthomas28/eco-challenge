document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items');
    const scoreDisplay = document.getElementById('score');
    const itemsLeftDisplay = document.getElementById('itemsLeft');
    const resultDiv = document.getElementById('result');
    const finalScoreDisplay = document.getElementById('finalScore');
    const restartBtn = document.getElementById('restartBtn');
    const homeBtn = document.getElementById('homeBtn');

    const username = localStorage.getItem('loggedInUser');
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let score = username && users[username] ? users[username].points : 0; // Start with existing points
    let itemsLeft = 5;
    let draggedItem = null;

    const items = [
        { name: 'Plastic Bottle', type: 'plastic', image: 'https://t4.ftcdn.net/jpg/04/98/36/27/360_F_498362712_7sJRmv7sOsfCtqieE0wtIjUpdUBvF4PY.jpg' },
        { name: 'Newspaper', type: 'paper', image: 'https://5.imimg.com/data5/SELLER/Default/2022/6/WR/MF/TZ/79268969/newspaper-waste.jpg' },
        { name: 'Glass Jar', type: 'glass', image: 'https://m.media-amazon.com/images/I/615YZTWu43L._AC_UF894,1000_QL80_.jpg' },
        { name: 'Banana Peel', type: 'organic', image: 'https://t4.ftcdn.net/jpg/00/90/51/79/360_F_90517993_KqwLbrt8BtKCjfxdWzADyzWiMxPoyd88.jpg' },
        { name: 'Old Battery', type: 'trash', image: 'https://images.fineartamerica.com/images-medium-large-5/old-batteries-public-health-england.jpg' }
    ];

    function initGame() {
        itemsContainer.innerHTML = '';
        itemsLeft = items.length;
        scoreDisplay.textContent = score;
        itemsLeftDisplay.textContent = itemsLeft;
        resultDiv.classList.add('hidden');

        items.forEach(item => {
            const img = document.createElement('img');
            img.classList.add('item');
            img.src = item.image;
            img.alt = item.name; // Accessibility
            img.dataset.type = item.type;
            img.draggable = true; // Ensure draggability

            // Mouse events
            img.addEventListener('dragstart', dragStart);
            img.addEventListener('dragend', dragEnd);

            // Touch events
            img.addEventListener('touchstart', touchStart, { passive: false });
            img.addEventListener('touchmove', touchMove, { passive: false });
            img.addEventListener('touchend', touchEnd, { passive: false });

            itemsContainer.appendChild(img);
        });

        document.querySelectorAll('.bin').forEach(bin => {
            bin.addEventListener('dragover', dragOver);
            bin.addEventListener('drop', drop);
            bin.addEventListener('dragenter', dragEnter);
            bin.addEventListener('dragleave', dragLeave);
        });
    }

    // Mouse Drag Events
    function dragStart(e) {
        draggedItem = e.target;
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
        setTimeout(() => e.target.classList.add('dragging'), 0);
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
        draggedItem = null;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        const itemType = e.dataTransfer.getData('text/plain');
        const binType = e.target.dataset.type;

        if (itemType === binType) {
            score += 10;
            scoreDisplay.textContent = score;
        }

        draggedItem.remove();
        e.target.classList.remove('drag-over');
        itemsLeft--;
        itemsLeftDisplay.textContent = itemsLeft;

        if (itemsLeft === 0) {
            endGame();
        }
    }

    // Touch Events
    function touchStart(e) {
        e.preventDefault();
        draggedItem = e.target;
        draggedItem.classList.add('dragging');
        const touch = e.touches[0];
        draggedItem.style.position = 'absolute';
        moveItem(touch.pageX, touch.pageY);
    }

    function touchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        moveItem(touch.pageX, touch.pageY);

        const bin = getBinUnderPoint(touch.pageX, touch.pageY);
        document.querySelectorAll('.bin').forEach(b => b.classList.remove('drag-over'));
        if (bin) bin.classList.add('drag-over');
    }

    function touchEnd(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const bin = getBinUnderPoint(touch.pageX, touch.pageY);

        if (bin && draggedItem.dataset.type === bin.dataset.type) {
            score += 10;
            scoreDisplay.textContent = score;
        }

        draggedItem.remove();
        document.querySelectorAll('.bin').forEach(b => b.classList.remove('drag-over'));
        itemsLeft--;
        itemsLeftDisplay.textContent = itemsLeft;

        if (itemsLeft === 0) {
            endGame();
        }
        draggedItem = null;
    }

    function moveItem(x, y) {
        if (draggedItem) {
            draggedItem.style.left = `${x - draggedItem.offsetWidth / 2}px`;
            draggedItem.style.top = `${y - draggedItem.offsetHeight / 2}px`;
        }
    }

    function getBinUnderPoint(x, y) {
        const bins = document.querySelectorAll('.bin');
        for (let bin of bins) {
            const rect = bin.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return bin;
            }
        }
        return null;
    }

    function endGame() {
        finalScoreDisplay.textContent = score;
        resultDiv.classList.remove('hidden');
        if (username && users[username]) {
            users[username].points = score; // Update unified points
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    restartBtn.addEventListener('click', () => {
        initGame();
    });

    homeBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });

    // Start the game
    initGame();
});