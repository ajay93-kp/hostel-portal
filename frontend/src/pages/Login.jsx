// import api from "../api/client";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/useAuth.jsx";

// export default function Login() {
//   const [authMode, setAuthMode] = useState("google");
//   const { login } = useAuth();
//   const nav = useNavigate();

//   useEffect(() => {
//     setAuthMode(import.meta.env.VITE_AUTH_MODE || "google");
//   }, []);

//   const handleDevLogin = async (e) => {
//     e.preventDefault();
//     const fd = new FormData(e.currentTarget);
//     const payload = Object.fromEntries(fd.entries());

//     try {
//       const { data } = await api.post("/auth/dev-login", payload);

//       // Use new login object parameter
//       login({ userData: data.user, tokenData: data.token });

//       if (data.user.role === "student") nav("/student");
//       else if (data.user.role === "employee") nav("/employee");
//       else if (data.user.role === "admin") nav("/admin");
//       else nav("/");
//     } catch (error) {
//       console.error("Dev login failed:", error);
//       alert("Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Login</h2>

//       {authMode === "google" && (
//         <div>
//           <p>Sign in with your Google account:</p>
//           <a
//             className="btn primary"
//             href={`${import.meta.env.VITE_API_BASE.replace("/api", "")}/api/auth/google`}
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
//         Tip: For offline testing, set <code>VITE_AUTH_MODE=local</code> in frontend{" "}
//         <code>.env</code>.
//       </p>
//     </div>
//   );
// }


import api from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";

export default function Login() {
  const [authMode, setAuthMode] = useState("google");
  const { user, login } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    setAuthMode(import.meta.env.VITE_AUTH_MODE || "google");
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === "student") nav("/student");
      else if (user.role === "employee") nav("/employee");
      else if (user.role === "admin") nav("/admin");
      else nav("/");
    }
  }, [user, nav]);

  const handleDevLogin = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const { data } = await api.post("/auth/dev-login", payload);

      login({ userData: data.user, tokenData: data.token });

      if (data.user.role === "student") nav("/student");
      else if (data.user.role === "employee") nav("/employee");
      else if (data.user.role === "admin") nav("/admin");
      else nav("/");
    } catch (error) {
      console.error("Dev login failed:", error);
      alert("Login failed. Please try again.");
    }
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
          <input
            className="input"
            name="name"
            placeholder="Name"
            required
            defaultValue="Sam Student"
          />
          <input
            className="input"
            name="email"
            placeholder="Email"
            required
            defaultValue="student1@example.com"
          />
          <select className="select" name="role" defaultValue="student">
            <option value="student">Student</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn">Continue (Local)</button>
        </form>
      )}

      <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Tip: For offline testing, set <code>VITE_AUTH_MODE=local</code> in frontend{" "}
        <code>.env</code>.
      </p>
    </div>
  );
}
