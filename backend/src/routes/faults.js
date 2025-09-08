import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { pool } from "../config/db.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

// Multer config
const uploadDir = path.join(process.cwd(), "src", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create fault (student)
router.post("/", requireAuth, requireRoles("student"), upload.single("image"), async (req, res) => {
  try {
    const { name, reg_no, hostel_name, floor, description } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    // Call ML service for category
    let predicted_category = "other", confidence = 0.0;
    try {
      if (image_path) {
        const mlUrl = `${process.env.ML_SERVICE_URL}/predict`;
        const form = new FormData();
        form.append("image", fs.createReadStream(path.join(uploadDir, path.basename(image_path))));
        const { data } = await axios.post(mlUrl, form, { headers: form.getHeaders() });
        predicted_category = data?.category || "other";
        confidence = data?.confidence ?? 0.0;
      }
    } catch (e) {
      console.error("ML service error:", e?.message);
    }

    const [result] = await pool.execute(
      `INSERT INTO faults (student_id, name, reg_no, hostel_name, floor, description, image_path, predicted_category)
       VALUES (?,?,?,?,?,?,?,?)`,
      [req.user.id, name, reg_no, hostel_name, floor, description || null, image_path, predicted_category]
    );

    const [rows] = await pool.execute("SELECT * FROM faults WHERE id=?", [result.insertId]);
    res.status(201).json({ fault: rows[0], ml: { predicted_category, confidence } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create fault" });
  }
});

// Student: list my faults
router.get("/mine", requireAuth, requireRoles("student"), async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM faults WHERE student_id=? ORDER BY created_at DESC", [req.user.id]);
  res.json({ faults: rows });
});

// Admin: list all faults
router.get("/", requireAuth, requireRoles("admin"), async (_req, res) => {
  const [rows] = await pool.execute(
    `SELECT f.*, a.employee_id
     FROM faults f
     LEFT JOIN assignments a ON a.fault_id = f.id
     ORDER BY f.created_at DESC`
  );
  res.json({ faults: rows });
});

// Employee: update status for an assigned fault
router.patch("/:id/status", requireAuth, requireRoles("employee"), async (req, res) => {
  const faultId = req.params.id;
  const { status } = req.body;
  if (!["pending", "in-progress", "resolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Ensure this employee is assigned
  const [asgn] = await pool.execute(
    "SELECT * FROM assignments WHERE fault_id=? AND employee_id=?",
    [faultId, req.user.id]
  );
  if (!asgn.length) return res.status(403).json({ message: "Not your assignment" });

  await pool.execute("UPDATE faults SET status=? WHERE id=?", [status, faultId]);

  if (status === "in-progress" && !asgn[0].started_at) {
    await pool.execute("UPDATE assignments SET started_at=CURRENT_TIMESTAMP WHERE id=?", [asgn[0].id]);
  }
  if (status === "resolved" && !asgn[0].completed_at) {
    await pool.execute("UPDATE assignments SET completed_at=CURRENT_TIMESTAMP WHERE id=?", [asgn[0].id]);
    await pool.execute("UPDATE employees SET availability='available' WHERE id=?", [req.user.id]);
  }

  const [rows] = await pool.execute("SELECT * FROM faults WHERE id=?", [faultId]);
  res.json({ fault: rows[0] });
});

export default router;
