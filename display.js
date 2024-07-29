document.addEventListener('DOMContentLoaded', function() {
    const savedTextsList = document.querySelector('#savedTextsList');
    const menuCheckbox = document.getElementById('menuCheckbox');
    const refreshMessage = document.querySelector('.refresh-message');

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
    

    function loadItems() {

        const keys = Object.keys(localStorage);


        const items = keys
            .filter(key => key.startsWith('input-')) 
            .map(key => ({ 
                timestamp: new Date(key.substring(6)), 
                key, 
                value: JSON.parse(localStorage.getItem(key)) 
            }))
            .sort((a, b) => b.timestamp - a.timestamp); 

        savedTextsList.innerHTML = '';

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.value.text} (${formatElapsedTime(item.timestamp)})`;

            const completeButton = document.createElement('button');
            completeButton.textContent = '완료';
            completeButton.onclick = () => removeItem(item.key);

            listItem.appendChild(completeButton);
            savedTextsList.appendChild(listItem);
        });

        if (savedTextsList.children.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = '저장된 항목이 없습니다.';
            savedTextsList.appendChild(listItem);
        }
    }
    

    function removeItem(key) {
        localStorage.removeItem(key);
        loadItems();
    }


    loadItems();
    
    setInterval(() => {
        loadItems(); 
    }, 1000); 


});
