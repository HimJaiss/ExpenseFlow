import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, employeeId: user.employeeId };
}
export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password." });
  const token = jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.json({ token, user: safeUser(user) });
}
export async function me(req, res) { res.json({ user: safeUser(req.user) }); }
