// // frontend/src/pages/OAuthCallback.jsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const OAuthCallback = ({ onAuth }) => {
//   const nav = useNavigate();

//   useEffect(() => {
//     const handleCallback = async () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const token = urlParams.get("token");

//       if (!token) {
//         nav("/login");
//         return;
//       }

//       try {
//         // Save token in localStorage
//         localStorage.setItem("token", token);

//         // Get user details from backend
//         const res = await api.get("/auth/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         onAuth && onAuth(res.data.user);

//         // Redirect based on role
//         if (res.data.user.role === "student") {
//           nav("/student");
//         } else if (res.data.user.role === "employee") {
//           nav("/employee");
//         } else if (res.data.user.role === "admin") {
//           nav("/admin");
//         } else {
//           nav("/");
//         }
//       } catch {
//         nav("/login");
//       }
//     };

//     handleCallback();
//   }, [nav, onAuth]);

//   return <p className="text-center mt-10">Logging you in with Google...</p>;
// };

// export default OAuthCallback;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function OAuthCallback() {
  const nav = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        nav("/login");
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        login(token, res.data.user);

        if (res.data.user.role === "student") nav("/student");
        else if (res.data.user.role === "employee") nav("/employee");
        else if (res.data.user.role === "admin") nav("/admin");
        else nav("/");
      } catch {
        nav("/login");
      }
    };

    handleCallback();
  }, [nav, login]);

  return <p className="text-center mt-10">Logging you in with Google...</p>;
}
