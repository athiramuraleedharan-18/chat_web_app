document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    const chatArea = document.getElementById('chat-area');
    const userMessageElem = document.createElement('div');
    userMessageElem.className = 'message user-message';
    userMessageElem.innerText = userInput;
    chatArea.appendChild(userMessageElem);

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        const botMessageElem = document.createElement('div');
        botMessageElem.className = 'message bot-message';
        botMessageElem.innerText = data.response;
        chatArea.appendChild(botMessageElem);

        document.getElementById('user-input').value = '';
        chatArea.scrollTop = chatArea.scrollHeight;
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

document.getElementById('history-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/history');
        const history = await response.json();

        const chatArea = document.getElementById('chat-area');
        chatArea.innerHTML = '';

        history.forEach(chat => {
            const userMessageElem = document.createElement('div');
            userMessageElem.className = 'message user-message';
            userMessageElem.innerText = chat.userMessage;
            chatArea.appendChild(userMessageElem);

            const botMessageElem = document.createElement('div');
            botMessageElem.className = 'message bot-message';
            botMessageElem.innerText = chat.botResponse;
            chatArea.appendChild(botMessageElem);
        });

        chatArea.scrollTop = chatArea.scrollHeight;
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
});

document.getElementById('new-chat-btn').addEventListener('click', () => {
    document.getElementById('chat-area').innerHTML = '';
});
