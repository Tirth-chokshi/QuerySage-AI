import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String,default: 'Unknown' },
  lastName: { type: String,default: 'Unknown' },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: "user" },
  image: { type: String },
  authProviderId: { type: String }

});

const User = mongoose.models?.User || mongoose.model("User", userSchema);
export default User;