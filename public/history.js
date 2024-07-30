document.addEventListener('DOMContentLoaded', function() {
    const historyArea = document.getElementById('history-area');
    const backBtn = document.getElementById('back-btn');

    // Example data; replace with actual data loading logic
    const chatHistory = [
        { type: 'user', content: 'Hello!', timestamp: '2024-07-30 12:00:00' },
        { type: 'bot', content: 'Hi there!', timestamp: '2024-07-30 12:01:00' },
        // Add more messages here
    ];

    chatHistory.forEach(msg => {
        historyArea.innerHTML += `
            <div class="chat-message ${msg.type}">
                <img src="assets/${msg.type}-avatar.png" class="avatar" alt="${msg.type} Avatar">
                <div class="message-content">${msg.content}</div>
                <div class="timestamp">${msg.timestamp}</div>
            </div>
        `;
    });

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html'; // Go back to main chat page
    });
});
