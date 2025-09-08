import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { useAuth } from "./context/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // Determine the home link dynamically
  const homeLink = user ? `/${user.role}` : "/";

  return (
    <>
      <nav className="nav">
        <Link to={homeLink}>Home</Link>
        {user?.role === "student" && <Link to="/student">Student</Link>}
        {user?.role === "employee" && <Link to="/employee">Employee</Link>}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>
                {user.name} — <b>{user.role}</b>
              </span>
              <button
                className="btn"
                onClick={() => {
                  logout();
                  nav("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link className="btn" to="/login">
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <div className="card">
                <h2>Hostel Management Portal</h2>
                <p>
                  Report faults, assign to employees, and track status. Secure
                  login with Google or Local mode.
                </p>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
