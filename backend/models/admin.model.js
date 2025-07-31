import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  telegramId: { type: String, unique: true, sparse: true }
});

export default mongoose.model("Admin", adminSchema);
