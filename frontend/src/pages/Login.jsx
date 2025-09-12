import api from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";
import "../styles/Login.css";

export default function Login() {
  const [authMode, setAuthMode] = useState("local"); // Set 'local' for this simple form
  const { user, login } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    setAuthMode(import.meta.env.VITE_AUTH_MODE || "local");
  }, []);

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

  if (authMode !== "local") {
    // Render message or fallback if necessary for google mode
    return (
      <div className="login-container">
        <a
          href={`${import.meta.env.VITE_API_BASE.replace("/api", "")}/api/auth/google`}
          className="google-signin"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleDevLogin} noValidate>
        <input
          type="email"
          name="email"
          placeholder="Email or Username"
          required
          className="input-field"
          autoComplete="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="input-field"
          autoComplete="current-password"
        />
        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>

      <a
        href={`${import.meta.env.VITE_API_BASE.replace("/api", "")}/api/auth/google`}
        className="google-signin"
      >
        Sign in with Google
      </a>
    </div>
  );
}
