const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = 'JJmuZS3mLmx3TYWCipWIwUXEjqwaySHL'; // Your API key
const externalUserId = '66e4143fea8a8a3d4feb9fc2'; // Static external user ID

// Middleware to serve static files (CSS, JS, images)
app.use(express.static('public'));
app.use(bodyParser.json());

// Route for home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route for chat page
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

// Route for about page
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/public/about.html');
});

// Route for contact page
app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/public/contact.html');
});
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Create chat session function
async function createChatSession() {
    try {
        const response = await axios.post(
            'https://api.on-demand.io/chat/v1/sessions',
            {
                pluginIds: [],
                externalUserId: externalUserId
            },
            {
                headers: {
                    apikey: apiKey
                }
            }
        );
        return response.data.data.id; // Extract session ID
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
    }
}

// Submit query to chat session function
async function submitQuery(sessionId, query) {
    try {
        const response = await axios.post(
            `https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`,
            {
                endpointId: 'predefined-openai-gpt4o',
                query: query,
                pluginIds: ['plugin-1712327325', 'plugin-1713962163', 'plugin-1726233548'],
                responseMode: 'sync'
            },
            {
                headers: {
                    apikey: apiKey
                }
            }
        );
        return response.data.data; // Extract response
    } catch (error) {
        console.error('Error submitting query:', error);
        throw error;
    }
}

app.post('/api/chat', async (req, res) => {
    const userQuery = req.body.query;

    try {
        // Create chat session
        const sessionId = await createChatSession();

        // Submit query and get response
        const chatResponse = await submitQuery(sessionId, userQuery);

        res.json({ response: chatResponse.result });
    } catch (error) {
        console.error('Error handling chat interaction:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});
app.post('/api/chat', (req, res) => {
    console.log(req.body.query); // Log the query
    res.send('Received query: ' + req.body.query);
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
