import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  // 🚫 No user → go to login
  if (!user) return <Navigate to="/login" replace />;

  // 🚫 Wrong role → go back home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ User allowed → render page
  return children;
}
