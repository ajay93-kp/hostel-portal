import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import faultRoutes from "./routes/faults.js";
import employeeRoutes from "./routes/employees.js";
import adminRoutes from "./routes/admin.js";
import { cookies } from "./middleware/auth.js";
import { pool } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookies);

// Static for uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")));

// Health & DB check
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/faults", faultRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled:", err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
