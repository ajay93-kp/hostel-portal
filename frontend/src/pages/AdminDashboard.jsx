import { useEffect, useState } from "react";
import api from "../api/client";
import FaultList from "../components/FaultList";
import { eventBus } from "../utils/eventBus";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [faults, setFaults] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    "in-progress": 0,
    resolved: 0,
    other: 0
  });
  const [employees, setEmployees] = useState([]);
  const [toAssign, setToAssign] = useState(null);
  const [empId, setEmpId] = useState("");

  const load = async () => {
    const { data } = await api.get("/faults");
    setFaults(data.faults || []);
    const { data: emps } = await api.get("/employees?availability=available");
    setEmployees(emps.employees || []);
    try {
      const { data: summary } = await api.get("/admin/fault-summary");
      setCounts(summary.counts);
    } catch (e) {
      console.error("Failed to fetch fault summary", e);
    }
  };

  const doAssign = async () => {
    await api.post("/admin/assign", { fault_id: toAssign.id, employee_id: empId });
    setToAssign(null);
    setEmpId("");
    await load();
    eventBus.emit("refreshFaults");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="dashboard-summary">
        <div className="card summary-card">
          <h4>Total Faults</h4>
          <p>{counts.total}</p>
        </div>
        <div className="card summary-card">
          <h4>Pending Faults</h4>
          <p>{counts.pending}</p>
        </div>
        <div className="card summary-card">
          <h4>In Progress Faults</h4>
          <p>{counts["in-progress"]}</p>
        </div>
        <div className="card summary-card">
          <h4>Resolved Faults</h4>
          <p>{counts.resolved}</p>
        </div>
      </div>

      <FaultList faults={faults} allowAssign onAssign={setToAssign} />

      {toAssign && (
        <div className="card">
          <h4>Assign fault #{toAssign.id}</h4>
          <select className="select" value={empId} onChange={e => setEmpId(e.target.value)}>
            <option value="">Select employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.specialization} ({e.availability})
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn primary" disabled={!empId} onClick={doAssign}>Assign</button>
            <button className="btn" onClick={() => { setToAssign(null); setEmpId(""); }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
