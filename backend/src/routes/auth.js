// import { Router } from "express";
// import passport from "../config/passport.js";
// import { signToken } from "../utils/jwt.js";
// import { pool } from "../config/db.js";

// const router = Router();

// // Google OAuth (disabled when AUTH_MODE=local)
// router.get("/google", (req, res, next) => {
//   if (process.env.AUTH_MODE === "local") return res.status(400).json({ message: "Google auth disabled in local mode" });
//   passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
// });

// router.get("/google/callback", (req, res, next) => {
//   passport.authenticate("google", { session: false }, (err, user) => {
//     if (err || !user) return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
//     const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
//     // httpOnly cookie
//     res.cookie("access_token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 86400000 });
//     return res.redirect(`${process.env.CLIENT_URL}/`);
//   })(req, res, next);
// });

// // Dev-only local login (offline)
// router.post("/dev-login", async (req, res) => {
//   if (process.env.AUTH_MODE !== "local") return res.status(400).json({ message: "Dev login only in local mode" });

//   const { email, name, role = "student" } = req.body || {};
//   if (!email || !name) return res.status(400).json({ message: "email and name required" });
//   if (!["student", "employee", "admin"].includes(role)) return res.status(400).json({ message: "invalid role" });

//   // Upsert user by email
//   const [rows] = await pool.execute("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
//   let user = rows[0];
//   if (!user) {
//     const [result] = await pool.execute("INSERT INTO users (email, name, role) VALUES (?,?,?)", [email, name, role]);
//     const [created] = await pool.execute("SELECT * FROM users WHERE id=?", [result.insertId]);
//     user = created[0];
//   } else if (user.role !== role) {
//     await pool.execute("UPDATE users SET role=? WHERE id=?", [role, user.id]);
//     const [updated] = await pool.execute("SELECT * FROM users WHERE id=?", [user.id]);
//     user = updated[0];
//   }

//   const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
//   res.cookie("access_token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 86400000 });
//   res.json({ message: "Logged in (local)", user: { id: user.id, email: user.email, role: user.role, name: user.name } });
// });

// router.get("/me", (req, res) => {
//   const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(200).json({ user: null });
//   try {
//     const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
//     return res.json({ user: { id: payload.id, email: payload.email, role: payload.role, name: payload.name } });
//   } catch {
//     return res.json({ user: null });
//   }
// });

// router.post("/logout", (req, res) => {
//   res.clearCookie("access_token");
//   res.json({ message: "Logged out" });
// });

// export default router;


import { Router } from "express";
import passport from "../config/passport.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { pool } from "../config/db.js";

const router = Router();

// Google OAuth (disabled when AUTH_MODE=local)
router.get("/google", (req, res, next) => {
  if (process.env.AUTH_MODE === "local")
    return res.status(400).json({ message: "Google auth disabled in local mode" });

  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user)
      return res.status(401).json({ message: "OAuth login failed" });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // httpOnly cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 86400000,
    });

    // Send user data and token in JSON (SPA-friendly)
    return res.status(200).json({
      message: "Logged in with Google",
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      token,
    });
  })(req, res, next);
});

// Dev-only local login (offline)
router.post("/dev-login", async (req, res) => {
  if (process.env.AUTH_MODE !== "local")
    return res.status(400).json({ message: "Dev login only in local mode" });

  const { email, name, role = "student" } = req.body || {};
  if (!email || !name) return res.status(400).json({ message: "email and name required" });
  if (!["student", "employee", "admin"].includes(role))
    return res.status(400).json({ message: "invalid role" });

  // Upsert user by email
  const [rows] = await pool.execute("SELECT * FROM users WHERE email=? LIMIT 1", [email]);
  let user = rows[0];

  if (!user) {
    const [result] = await pool.execute(
      "INSERT INTO users (email, name, role) VALUES (?,?,?)",
      [email, name, role]
    );
    const [created] = await pool.execute("SELECT * FROM users WHERE id=?", [result.insertId]);
    user = created[0];
  } else if (user.role !== role) {
    await pool.execute("UPDATE users SET role=? WHERE id=?", [role, user.id]);
    const [updated] = await pool.execute("SELECT * FROM users WHERE id=?", [user.id]);
    user = updated[0];
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 86400000,
  });

  res.json({
    message: "Logged in (local)",
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
    token,
  });
});

// Get current user
router.get("/me", (req, res) => {
  const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(200).json({ user: null });

  try {
    const payload = verifyToken(token);
    return res.json({
      user: { id: payload.id, email: payload.email, role: payload.role, name: payload.name },
    });
  } catch {
    return res.status(401).json({ user: null });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out" });
});

export default router;
