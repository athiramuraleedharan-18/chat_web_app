import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('MongoDB URI is not defined in environment variables.');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Chat history schema
const chatSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// API Routes
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await fetch(process.env.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAWAN_API_KEY}`
      },
      body: JSON.stringify({ model: 'pai-001', messages: [{ role: 'user', content: message }] })
    });

    const data = await response.json();
    if (!data.choices || !data.choices.length) {
      throw new Error('Invalid response from API');
    }

    const botResponse = data.choices[0].message.content;

    // Save chat to MongoDB
    await Chat.create({
      userMessage: message,
      botResponse
    });

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error handling chat request:', error);
    res.status(500).json({ error: 'API Error' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await Chat.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Static files and main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
