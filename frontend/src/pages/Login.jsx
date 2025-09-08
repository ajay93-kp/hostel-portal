// import api from "../api/client";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Login({ onAuth }) {
//   const [authMode, setAuthMode] = useState("google");
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Redirect user to their dashboard based on role
//   const redirectByRole = (role) => {
//     if (role === "student") navigate("/student");
//     else if (role === "employee") navigate("/employee");
//     else if (role === "admin") navigate("/admin");
//     else navigate("/");
//   };

//   useEffect(() => {
//     setAuthMode(import.meta.env.VITE_AUTH_MODE || "google");

//     // Handle redirect from Google OAuth
//     const params = new URLSearchParams(location.search);
//     const role = params.get("role");

//     if (role) {
//       api.get("/auth/me")
//         .then((res) => {
//           if (res.data.user) {
//             onAuth && onAuth(res.data.user);
//             redirectByRole(res.data.user.role);
//           }
//         })
//         .catch(() => {
//           console.log("Failed to fetch user after OAuth");
//         });
//     }
//   }, []);

//   const handleDevLogin = async (e) => {
//     e.preventDefault();
//     const fd = new FormData(e.currentTarget);
//     const payload = Object.fromEntries(fd.entries());
//     const { data } = await api.post("/auth/dev-login", payload);
//     onAuth && onAuth(data.user);
//     redirectByRole(data.user.role);
//   };

//   return (
//     <div className="card">
//       <h2>Login</h2>

//       {authMode === "google" && (
//         <div>
//           <p>Sign in with your Google account:</p>
//           <a
//             className="btn primary"
//             href={`${import.meta.env.VITE_API_BASE.replace(
//               "/api",
//               ""
//             )}/api/auth/google`}
//           >
//             Sign in with Google
//           </a>
//         </div>
//       )}

//       {authMode === "local" && (
//         <form onSubmit={handleDevLogin} style={{ minWidth: 300 }}>
//           <h4>Dev Local Login (offline)</h4>
//           <input
//             className="input"
//             name="name"
//             placeholder="Name"
//             required
//             defaultValue="Sam Student"
//           />
//           <input
//             className="input"
//             name="email"
//             placeholder="Email"
//             required
//             defaultValue="student1@example.com"
//           />
//           <select className="select" name="role" defaultValue="student">
//             <option value="student">Student</option>
//             <option value="employee">Employee</option>
//             <option value="admin">Admin</option>
//           </select>
//           <button className="btn">Continue (Local)</button>
//         </form>
//       )}

//       <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
//         Tip: For offline testing, set <code>VITE_AUTH_MODE=local</code> in your frontend <code>.env</code>.
//       </p>
//     </div>
//   );
// }

import api from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [authMode, setAuthMode] = useState("google");
  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    setAuthMode(import.meta.env.VITE_AUTH_MODE || "google");
  }, []);

  const handleDevLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const { data } = await api.post("/auth/dev-login", payload);

    login(data.token, data.user);

    if (data.user.role === "student") nav("/student");
    else if (data.user.role === "employee") nav("/employee");
    else if (data.user.role === "admin") nav("/admin");
    else nav("/");
  };

  return (
    <div className="card">
      <h2>Login</h2>

      {authMode === "google" && (
        <div>
          <p>Sign in with your Google account:</p>
          <a
            className="btn primary"
            href={`${import.meta.env.VITE_API_BASE.replace("/api", "")}/api/auth/google`}
          >
            Sign in with Google
          </a>
        </div>
      )}

      {authMode === "local" && (
        <form onSubmit={handleDevLogin} style={{ minWidth: 300 }}>
          <h4>Dev Local Login (offline)</h4>
          <input className="input" name="name" placeholder="Name" required defaultValue="Sam Student" />
          <input className="input" name="email" placeholder="Email" required defaultValue="student1@example.com" />
          <select className="select" name="role" defaultValue="student">
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn">Continue (Local)</button>
        </form>
      )}

      <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Tip: For offline testing, set <code>VITE_AUTH_MODE=local</code> in frontend <code>.env</code>.
      </p>
    </div>
  );
}

