import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv and express
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define a schema and model for chat history
const messageSchema = new mongoose.Schema({
    message: String,
    response: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL: 'https://api.pawan.krd/v1'
});

// Use static files from public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

app.get('/history', async (req, res) => {
    try {
        const history = await Message.find().sort({ createdAt: -1 }); // Sort by most recent
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).send('Error fetching history');
    }
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: userMessage }],
            model: 'pai-001' // Ensure this model is correct and available
        });

        const responseMessage = chatCompletion.choices[0].message.content;

        // Save to MongoDB
        await Message.create({ message: userMessage, response: responseMessage });

        res.json({ response: responseMessage }); // Return response message only
    } catch (error) {
        console.error('Error calling AI API:', error);
        res.status(500).send('Error processing request');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
