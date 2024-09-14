document.getElementById('start-chat-btn').addEventListener('click', function() {
    startChat();
});

async function startChat() {
    try {
        const query = 'Hello'; // You can dynamically get the user query here
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        const data = await response.json();
        console.log('Chat response:', data.response);
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');

    if (userInput.trim() === '') {
        return; // Prevent sending empty messages
    }

    // Display user message
    const userMessage = document.createElement('p');
    userMessage.textContent = 'You: ' + userInput;
    chatBox.appendChild(userMessage);

    // Send user input to the server for processing
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: userInput })
        });

        const data = await response.json();

        // Display bot response
        const botMessage = document.createElement('p');
        botMessage.textContent = 'Bot: ' + data.response;
        chatBox.appendChild(botMessage);
    } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error communicating with server.';
        chatBox.appendChild(errorMessage);
    }

    // Clear user input
    document.getElementById('user-input').value = '';
});
