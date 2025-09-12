import { useEffect, useState } from "react";
import api from "../api/client";
import FaultList from "../components/FaultList";

export default function FaultsPage() {
  const [faults, setFaults] = useState([]);

  const load = async () => {
    const { data } = await api.get("/faults/mine");
    setFaults(data.faults || []);
  };

  useEffect(() => {
    load();
  }, []);

  return <FaultList faults={faults} />;
}
