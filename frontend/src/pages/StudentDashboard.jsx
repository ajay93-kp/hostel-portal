import { useEffect, useState } from "react";
import api from "../api/client";
import FaultForm from "../components/FaultForm";
import FaultList from "../components/FaultList";

export default function StudentDashboard() {
  const [faults, setFaults] = useState([]);
  const load = async () => {
    const { data } = await api.get("/faults/mine");
    setFaults(data.faults || []);
  };
  useEffect(() => { load(); }, []);
  return (
    <>
      <FaultForm onCreated={() => load()} />
      <FaultList faults={faults} />
    </>
  );
}

