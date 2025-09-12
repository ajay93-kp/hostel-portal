// import { Router } from "express";
// import { pool } from "../config/db.js";
// import { requireAuth, requireRoles } from "../middleware/auth.js";

// const router = Router();

// // Assign a fault to an employee
// router.post("/assign", requireAuth, requireRoles("admin"), async (req, res) => {
//   const { fault_id, employee_id } = req.body || {};
//   if (!fault_id || !employee_id) return res.status(400).json({ message: "fault_id and employee_id required" });

//   // Check employee availability & specialization match (optional: match predicted_category)
//   const [empRows] = await pool.execute(
//     "SELECT u.id, e.specialization, e.availability FROM users u JOIN employees e ON e.id=u.id WHERE u.id=? AND u.role='employee'",
//     [employee_id]
//   );
//   if (!empRows.length) return res.status(404).json({ message: "Employee not found" });
//   if (empRows[0].availability !== "available") return res.status(400).json({ message: "Employee not available" });

//   // Create or update assignment
//   const [existing] = await pool.execute("SELECT * FROM assignments WHERE fault_id=?", [fault_id]);
//   if (existing.length) {
//     await pool.execute("UPDATE assignments SET employee_id=?, assigned_by=?, assigned_at=CURRENT_TIMESTAMP WHERE id=?",
//       [employee_id, req.user.id, existing[0].id]);
//   } else {
//     await pool.execute("INSERT INTO assignments (fault_id, employee_id, assigned_by) VALUES (?,?,?)",
//       [fault_id, employee_id, req.user.id]);
//   }

//   // Update fault status and employee availability
//   await pool.execute("UPDATE faults SET status='in-progress' WHERE id=?", [fault_id]);
//   await pool.execute("UPDATE employees SET availability='busy' WHERE id=?", [employee_id]);

//   res.json({ message: "Assigned successfully" });
// });

// export default router;

import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

// Assign a fault to an employee
router.post("/assign", requireAuth, requireRoles("admin"), async (req, res) => {
  const { fault_id, employee_id } = req.body || {};
  if (!fault_id || !employee_id) return res.status(400).json({ message: "fault_id and employee_id required" });

  // Check employee availability & specialization match (optional: match predicted_category)
  const [empRows] = await pool.execute(
    "SELECT u.id, e.specialization, e.availability FROM users u JOIN employees e ON e.id=u.id WHERE u.id=? AND u.role='employee'",
    [employee_id]
  );
  if (!empRows.length) return res.status(404).json({ message: "Employee not found" });
  if (empRows[0].availability !== "available") return res.status(400).json({ message: "Employee not available" });

  // Create or update assignment
  const [existing] = await pool.execute("SELECT * FROM assignments WHERE fault_id=?", [fault_id]);
  if (existing.length) {
    await pool.execute("UPDATE assignments SET employee_id=?, assigned_by=?, assigned_at=CURRENT_TIMESTAMP WHERE id=?",
      [employee_id, req.user.id, existing[0].id]);
  } else {
    await pool.execute("INSERT INTO assignments (fault_id, employee_id, assigned_by) VALUES (?,?,?)",
      [fault_id, employee_id, req.user.id]);
  }

  // Update fault status and employee availability
  await pool.execute("UPDATE faults SET status='in-progress' WHERE id=?", [fault_id]);
  await pool.execute("UPDATE employees SET availability='busy' WHERE id=?", [employee_id]);

  res.json({ message: "Assigned successfully" });
});

// Admin: get fault counts by status for admin dashboard
router.get("/fault-summary", requireAuth, requireRoles("admin"), async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT status, COUNT(*) AS count FROM faults GROUP BY status`
    );

    const counts = {
      total: 0,
      pending: 0,
      "in-progress": 0,
      resolved: 0,
      other: 0
    };

    rows.forEach(row => {
      counts.total += row.count;
      if (counts.hasOwnProperty(row.status)) {
        counts[row.status] = row.count;
      } else {
        counts.other += row.count;
      }
    });

    res.json({ counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch fault summary" });
  }
});

export default router;
