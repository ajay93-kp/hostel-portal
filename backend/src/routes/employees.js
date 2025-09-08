import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

// Admin: list employees optionally filtered
router.get("/", requireAuth, requireRoles("admin"), async (req, res) => {
  const { specialization, availability } = req.query;
  let sql = `SELECT u.id, u.name, u.email, e.specialization, e.availability 
             FROM users u JOIN employees e ON e.id=u.id WHERE u.role='employee'`;
  const vals = [];
  if (specialization) { sql += " AND e.specialization=?"; vals.push(specialization); }
  if (availability)   { sql += " AND e.availability=?";   vals.push(availability); }
  const [rows] = await pool.execute(sql, vals);
  res.json({ employees: rows });
});

// Employee: set availability
router.patch("/:id/availability", requireAuth, requireRoles("employee","admin"), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { availability } = req.body;
  if (!["available", "busy"].includes(availability)) return res.status(400).json({ message: "Invalid availability" });
  if (req.user.role === "employee" && req.user.id !== id) return res.status(403).json({ message: "Cannot change others" });
  await pool.execute("UPDATE employees SET availability=? WHERE id=?", [availability, id]);
  const [rows] = await pool.execute("SELECT u.id, u.name, u.email, e.specialization, e.availability FROM users u JOIN employees e ON e.id=u.id WHERE u.id=?", [id]);
  res.json({ employee: rows[0] });
});

export default router;
