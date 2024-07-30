import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    messages: [{ role: String, content: String }],
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
