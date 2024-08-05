import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  chatName: { type: String, required: true },
  dbType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat;