import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["employee", "director", "accounts"], required: true },
  department: { type: String, default: "General" },
  employeeId: { type: String, default: "" }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
