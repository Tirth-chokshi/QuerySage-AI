import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  firstName: { type: String,default: 'Unknown' },
  lastName: { type: String,default: 'Unknown' },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: "user" },
  image: { type: String },
  authProviderId: { type: String },
  chats: [chatSchema]
});

const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;