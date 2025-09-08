import { useEffect, useState } from "react";
import api from "../api/client";

export default function EmployeeDashboard() {
  const [faults, setFaults] = useState([]);

  const load = async () => {
    // Simple approach: all faults where an assignment exists for me
    const { data: me } = await api.get("/auth/me");
    const { data } = await api.get("/faults"); // admin route; alternative: add /faults/assigned-to-me
    // Filter client-side if you don't want to add a route:
    const my = (data.faults || []).filter(f => f.employee_id === me.user?.id);
    setFaults(my);
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/faults/${id}/status`, { status });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h3>My Assigned Faults</h3>
      <table className="table">
        <thead><tr><th>ID</th><th>Desc</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {faults.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.description}</td>
              <td>{f.status}</td>
              <td style={{display:"flex", gap:8}}>
                <button className="btn" onClick={()=>updateStatus(f.id,"in-progress")}>Start</button>
                <button className="btn" onClick={()=>updateStatus(f.id,"resolved")}>Resolve</button>
              </td>
            </tr>
          ))}
          {!faults.length && <tr><td colSpan={4}>No assignments yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}


