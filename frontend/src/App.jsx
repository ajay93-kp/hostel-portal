// import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import StudentDashboard from "./pages/StudentDashboard.jsx";
// import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";
// import api from "./api/client.js";
// import { useEffect, useState } from "react";

// // ProtectedRoute component
// function ProtectedRoute({ user, role, children }) {
//   if (!user || (role && user.role !== role)) {
//     return <Login onAuth={() => {}} />; // Redirect to login if not authorized
//   }
//   return children;
// }

// export default function App() {
//   const [user, setUser] = useState(null);
//   const nav = useNavigate();

//   useEffect(() => {
//     api.get("/auth/me").then(res => setUser(res.data.user || null)).catch(() => setUser(null));
//   }, []);

//   const logout = async () => {
//     await api.post("/auth/logout");
//     setUser(null);
//     nav("/login");
//   };

//   return (
//     <>
//       <nav className="nav">
//         <Link to="/">Home</Link>
//         <Link to="/student">Student</Link>
//         <Link to="/employee">Employee</Link>
//         <Link to="/admin">Admin</Link>
//         <div style={{ marginLeft: "auto" }}>
//           {user ? (
//             <>
//               <span style={{ marginRight: 12 }}>{user.name} — <b>{user.role}</b></span>
//               <button className="btn" onClick={logout}>Logout</button>
//             </>
//           ) : (
//             <Link className="btn" to="/login">Login</Link>
//           )}
//         </div>
//       </nav>

//       <div className="container">
//         <Routes>
//           <Route path="/" element={
//             <div className="card">
//               <h2>Hostel Management Portal</h2>
//               <p>Report faults, assign to employees, and track status. Offline-first with local ML classification.</p>
//             </div>
//           } />

//           <Route path="/login" element={<Login onAuth={(u)=>setUser(u)} />} />

//           <Route path="/student" element={
//             <ProtectedRoute user={user} role="student">
//               <StudentDashboard />
//             </ProtectedRoute>
//           } />

//           <Route path="/employee" element={
//             <ProtectedRoute user={user} role="employee">
//               <EmployeeDashboard />
//             </ProtectedRoute>
//           } />

//           <Route path="/admin" element={
//             <ProtectedRoute user={user} role="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </div>
//     </>
//   );
// }

// import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import OAuthCallback from "./pages/OAuthCallback.jsx";
// import StudentDashboard from "./pages/StudentDashboard.jsx";
// import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";
// import { useAuth } from "./context/AuthContext.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// export default function App() {
//   const { user, logout } = useAuth();
//   const nav = useNavigate();

//   return (
//     <>
//       <nav className="nav">
//         <Link to="/">Home</Link>
//         {user?.role === "student" && <Link to="/student">Student</Link>}
//         {user?.role === "employee" && <Link to="/employee">Employee</Link>}
//         {user?.role === "admin" && <Link to="/admin">Admin</Link>}
//         <div style={{ marginLeft: "auto" }}>
//           {user ? (
//             <>
//               <span style={{ marginRight: 12 }}>
//                 {user.name} — <b>{user.role}</b>
//               </span>
//               <button className="btn" onClick={() => { logout(); nav("/login"); }}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link className="btn" to="/login">
//               Login
//             </Link>
//           )}
//         </div>
//       </nav>

//       <div className="container">
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <div className="card">
//                 <h2>Hostel Management Portal</h2>
//                 <p>
//                   Report faults, assign to employees, and track status. Secure login with Google or Local mode.
//                 </p>
//               </div>
//             }
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/oauth/callback" element={<OAuthCallback />} />

//           <Route
//             path="/student"
//             element={
//               <ProtectedRoute allowedRoles={["student"]}>
//                 <StudentDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/employee"
//             element={
//               <ProtectedRoute allowedRoles={["employee"]}>
//                 <EmployeeDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute allowedRoles={["admin"]}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>
//     </>
//   );
// }


import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { useAuth } from "./context/useAuth.jsx"; // ✅ fixed
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <>
      <nav className="nav">
        <Link to="/">Home</Link>
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
                  Report faults, assign to employees, and track status. Secure login with Google or Local mode.
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
