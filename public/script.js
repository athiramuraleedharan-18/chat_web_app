document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const inputField = document.getElementById('inputField');
    const chatArea = document.getElementById('chatArea');
    const chatContainer = document.getElementById('chatContainer');
    const historyContainer = document.getElementById('historyContainer');
    const newChatTab = document.getElementById('newChatTab');
    const historyTab = document.getElementById('historyTab');

    // Function to add a message to the chat
    function addMessage(content, isUserMessage) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', isUserMessage ? 'user-message' : 'bot-message');
        
        const avatar = document.createElement('img');
        avatar.src = isUserMessage ? 'path/to/user-avatar.png' : 'path/to/bot-avatar.png';
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = content;
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        chatArea.appendChild(messageElement);
        
        chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
    }

    // Handle send button click
    sendButton.addEventListener('click', function() {
        const userInput = inputField.value;
        if (userInput.trim() !== '') {
            addMessage(userInput, true);
            inputField.value = '';
            
            // Simulate a response from the bot
            setTimeout(() => {
                addMessage('This is a bot response', false);
            }, 500);
        }
    });

    // Handle "New Chat" tab click
    newChatTab.addEventListener('click', function() {
        chatContainer.style.display = 'flex';
        historyContainer.style.display = 'none';
    });

    // Handle "History" tab click
    historyTab.addEventListener('click', function() {
        chatContainer.style.display = 'none';
        historyContainer.style.display = 'block';
    });
});
