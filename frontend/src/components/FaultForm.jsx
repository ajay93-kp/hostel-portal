import api from "../api/client";
import { useState } from "react";
import "../styles/FaultForm.css";

export default function FaultForm({ onCreated }) {
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      const { data } = await api.post("/faults", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onCreated && onCreated(data.fault);
      e.currentTarget.reset();
      alert(`Created. ML: ${data.ml?.predicted_category ?? "other"}`);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={submit} className="card">
      <h3>Report Fault</h3>
      <input className="input" name="name" placeholder="Your Name" required />
      <input className="input" name="reg_no" placeholder="Registration Number" required />
      <input className="input" name="hostel_name" placeholder="Hostel Name" required />
      <input className="input" name="floor" placeholder="Floor" required />
      <textarea className="textarea" name="description" placeholder="Describe the issue" rows={4} />
      <input className="input" type="file" name="image" accept="image/*" />
      <button className="btn primary" disabled={loading}>{loading ? "Uploading..." : "Submit"}</button>
    </form>
  );
}
