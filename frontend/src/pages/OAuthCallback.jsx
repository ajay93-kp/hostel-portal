import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";
import api from "../api/client";

export default function OAuthCallback() {
  const { login } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      nav("/login");
      return;
    }

    api
      .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        login({ userData: res.data.user, tokenData: token });

        if (res.data.user.role === "student") nav("/student");
        else if (res.data.user.role === "employee") nav("/employee");
        else if (res.data.user.role === "admin") nav("/admin");
        else nav("/");
      })
      .catch(() => nav("/login"));
  }, [login, nav]);

  return <p>Logging you in...</p>;
}

