document.addEventListener('DOMContentLoaded', function() {
    const menuCheckbox = document.getElementById('menuCheckbox');
    const menuItemsList = document.getElementById('menuItemsList');
    const reminderMessage = document.getElementById('reminderMessage');

    function formatElapsedTime(timestamp) {
        const now = new Date();
        const elapsed = now - timestamp;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let formattedTime = '';
        if (days > 0) formattedTime += `${days}일 `;
        if (hours % 24 > 0) formattedTime += `${hours % 24}시간 `;
        if (minutes % 60 > 0) formattedTime += `${minutes % 60}분 `;
        if (seconds % 60 > 0) formattedTime += `${seconds % 60}초`;

        return formattedTime.trim() || '0초';
    }

    function loadOldestItemInMenu() {
        const keys = Object.keys(localStorage);
        const items = keys
            .filter(key => key.startsWith('input-'))
            .map(key => ({ 
                timestamp: new Date(key.substring(6)),
                key,
                value: JSON.parse(localStorage.getItem(key))
            }))
            .sort((a, b) => a.timestamp - b.timestamp); // Sort by oldest first

        // Clear existing menu items
        menuItemsList.innerHTML = '';

        // Show the oldest item if it exists
        if (items.length > 0) {
            const oldestItem = items[0];
            const listItem = document.createElement('li');
            listItem.textContent = `${oldestItem.value.text} (${formatElapsedTime(oldestItem.timestamp)})`;

            // Add click event to navigate with query parameter
            listItem.addEventListener('click', () => {
                window.location.href = `display.html?key=${encodeURIComponent(oldestItem.key)}`;
            });

            menuItemsList.appendChild(listItem);

            // Show reminder message
            reminderMessage.textContent = "가장 오랜된 목표:";
        } else {
            // If no items, show a different message
            reminderMessage.textContent = "저장된 항목이 없습니다.";
        }
    }

    menuCheckbox.addEventListener('change', function() {
        if (menuCheckbox.checked) {
            loadOldestItemInMenu();
        }
    });

    // Initial load of the oldest item when the page loads
    loadOldestItemInMenu();
});

document.getElementById('userInput').addEventListener('input', function() {
    this.classList.add('brightening');
    clearTimeout(this.brightnessTimeout);
    this.brightnessTimeout = setTimeout(() => {
        this.classList.remove('brightening');
    }, 200);
});

document.getElementById('userInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const userInput = document.getElementById('userInput').value;
        if (userInput.trim() !== '') {
            const timestamp = new Date().toISOString();
            localStorage.setItem(`input-${timestamp}`, JSON.stringify({ text: userInput }));
            document.getElementById('userInput').value = '';
            window.location.href = 'display.html';
        }
    }
});