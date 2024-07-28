document.addEventListener('DOMContentLoaded', function() {
    const savedTextsList = document.querySelector('#savedTextsList');
    const menuCheckbox = document.getElementById('menuCheckbox');
    const refreshMessage = document.querySelector('.refresh-message');

    // Helper function to format elapsed time
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
    
    // Function to load and display items in the main content area
    function loadItems() {
        // Retrieve all items from localStorage
        const keys = Object.keys(localStorage);

        // Create an array of items with keys and values
        const items = keys
            .filter(key => key.startsWith('input-')) // Filter only relevant keys
            .map(key => ({ 
                timestamp: new Date(key.substring(6)), // Extract timestamp from key
                key, // Store the key for later use
                value: JSON.parse(localStorage.getItem(key)) // Get the value and parse JSON
            }))
            .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp (latest first)

        // Clear existing items
        savedTextsList.innerHTML = '';

        // Create list items for each entry with elapsed time
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.value.text} (${formatElapsedTime(item.timestamp)})`;

            // Create "완료" button
            const completeButton = document.createElement('button');
            completeButton.textContent = '완료';
            completeButton.onclick = () => removeItem(item.key);

            listItem.appendChild(completeButton);
            savedTextsList.appendChild(listItem);
        });

        // If there are no items, show a message
        if (savedTextsList.children.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = '저장된 항목이 없습니다.';
            savedTextsList.appendChild(listItem);
        }
    }

    // Function to remove an item
    function removeItem(key) {
        localStorage.removeItem(key);
        loadItems(); // Refresh the list
    }

    // Function to get a random motivational message


    // Initial load of items when the page loads
    loadItems();

    // Set up automatic refresh every 30 seconds
    setInterval(() => {
        loadItems(); // Reload items    
    }, 1000); // 30,000 milliseconds = 30 seconds

    // Set a random motivational message if refreshMessage exists
    if (refreshMessage) {
        refreshMessage.textContent = getRandomMotivationalMessage();
    }

    // Update menu items when the menu is opened
    menuCheckbox.addEventListener('change', function() {
        if (menuCheckbox.checked) {
            loadItemsInMenu();
        }
    });
});