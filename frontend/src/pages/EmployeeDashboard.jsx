import { useEffect, useState } from "react";
import api from "../api/client";
import { eventBus } from "../utils/eventBus";

export default function EmployeeDashboard() {
  const [faults, setFaults] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/faults/assigned-to-me");
      setFaults(data.faults || []);
    } catch (e) {
      console.error("Failed loading faults:", e);
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/faults/${id}/status`, { status });
    load();
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000); // Poll every 15 sec

    // Listen for refresh event from admin dashboard
    const refreshHandler = () => load();
    eventBus.on("refreshFaults", refreshHandler);

    return () => {
      clearInterval(interval);
      eventBus.off("refreshFaults", refreshHandler);
    };
  }, []);

  return (
    <div className="card">
      <h3>My Assigned Faults</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Desc</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faults.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.description}</td>
              <td>{f.status}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => updateStatus(f.id, "in-progress")}>
                  Start
                </button>
                <button className="btn" onClick={() => updateStatus(f.id, "resolved")}>
                  Resolve
                </button>
              </td>
            </tr>
          ))}
          {!faults.length && (
            <tr>
              <td colSpan={4}>No assignments yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
