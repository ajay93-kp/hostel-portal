import cookieParser from "cookie-parser";
import { verifyToken } from "../utils/jwt.js";

export const cookies = cookieParser();

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
