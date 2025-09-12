import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
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
  const location = useLocation();

  // Determine whether to show Home and Student links
  // We want to remove only "Home" and "Student" links from the navbar,
  // but keep navbar, user info, and logout button visible.
  const showHomeLink = false; // remove Home link as requested
  const showStudentLink = false; // remove Student link as requested

  return (
    <>
      {/* Show nav on all routes except root '/' */}
      {location.pathname !== "/" && (
        <nav className="nav">
          {/* Conditionally render Home link */}
          {showHomeLink && <Link to={user ? `/${user.role}` : "/"}>Home</Link>}

          {/* Conditionally render role links except Student */}
          {user?.role === "employee" && <Link to="/employee">Employee</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
          {/* Student link deliberately removed */}

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
                    nav("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn" to="/">
                Login
              </Link>
            )}
          </div>
        </nav>
      )}

      <div className={["/student", "/employee", "/admin"].includes(location.pathname) ? "container-full" : "container"}>
        <Routes>
          <Route path="/" element={<Home />} />
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
