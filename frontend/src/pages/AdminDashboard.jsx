// import { useEffect, useState } from "react";
// import api from "../api/client";
// import FaultList from "../components/FaultList";

// export default function AdminDashboard() {
//   const [faults, setFaults] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [toAssign, setToAssign] = useState(null);
//   const [empId, setEmpId] = useState("");

//   const load = async () => {
//     const { data } = await api.get("/faults");
//     setFaults(data.faults || []);
//     const { data: emps } = await api.get("/employees?availability=available");
//     setEmployees(emps.employees || []);
//   };

//   const doAssign = async () => {
//     await api.post("/admin/assign", { fault_id: toAssign.id, employee_id: empId });
//     setToAssign(null); setEmpId(""); load();
//   };

//   useEffect(() => { load(); }, []);

//   return (
//     <>
//       <FaultList faults={faults} allowAssign onAssign={setToAssign} />
//       {toAssign && (
//         <div className="card">
//           <h4>Assign fault #{toAssign.id}</h4>
//           <select className="select" value={empId} onChange={e=>setEmpId(e.target.value)}>
//             <option value="">Select employee</option>
//             {employees.map(e => (
//               <option key={e.id} value={e.id}>
//                 {e.name} — {e.specialization} ({e.availability})
//               </option>
//             ))}
//           </select>
//           <div style={{display:"flex", gap:8}}>
//             <button className="btn primary" disabled={!empId} onClick={doAssign}>Assign</button>
//             <button className="btn" onClick={()=>{setToAssign(null);setEmpId("");}}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useEffect, useState } from "react";
import api from "../api/client";
import FaultList from "../components/FaultList";
import { eventBus } from "../utils/eventBus";

export default function AdminDashboard() {
  const [faults, setFaults] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [toAssign, setToAssign] = useState(null);
  const [empId, setEmpId] = useState("");

  const load = async () => {
    const { data } = await api.get("/faults");
    setFaults(data.faults || []);
    const { data: emps } = await api.get("/employees?availability=available");
    setEmployees(emps.employees || []);
  };

  const doAssign = async () => {
    await api.post("/admin/assign", { fault_id: toAssign.id, employee_id: empId });
    setToAssign(null);
    setEmpId("");
    load();

    // Notify employee dashboards to refresh
    eventBus.emit("refreshFaults");
  };

  useEffect(() => { load(); }, []);

  return (
    <>
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
