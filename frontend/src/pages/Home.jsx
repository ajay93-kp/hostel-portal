import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";
import Login from "./Login.jsx";
import hostelImage from "../assets/hostel.jpeg";
import "../styles/Home.css"; // Import new styles

export default function Home() {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "student") nav("/student");
      else if (user.role === "employee") nav("/employee");
      else if (user.role === "admin") nav("/admin");
      else nav("/");
    }
  }, [user, nav]);

  return (
    <div className="home-container">
      <div className="left-side">
        <section className="welcome-section">
          <h1 className="title">Welcome to Hostel Management Portal</h1>
          <p className="description">
            Report faults, assign to employees, and track status all in one place.
            <br />
            Secure login with Google or Local mode.
          </p>
          <div className="login-wrapper">
            <Login />
          </div>
        </section>
      </div>

      <div className="right-side">
        <img
          src={hostelImage}
          alt="Hostel Management Illustration"
          className="right-image"
        />
      </div>
    </div>
  );
}
