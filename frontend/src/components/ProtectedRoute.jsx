// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ user, allowedRoles, children }) {
//   if (!user) {
//     // Not logged in → redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // Logged in but role not allowed → redirect to home
//     return <Navigate to="/" replace />;
//   }

//   // User is allowed → render children
//   return children;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
