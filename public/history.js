document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/history')  // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            const historyList = document.getElementById('history-list');
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'history-item';
                listItem.innerHTML = `
                    <div class="message">${item.message}</div>
                    <div class="response">${item.response}</div>
                    <div class="date">${new Date(item.createdAt).toLocaleDateString()}</div>
                `;
                historyList.appendChild(listItem);
            });
        });
});
