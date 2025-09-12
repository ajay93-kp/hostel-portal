import { useState } from "react";
import FaultForm from "../components/FaultForm";

export default function ReportFault() {
  // Using local state to trigger reload in FaultsPage if needed later
  const [reloadKey, setReloadKey] = useState(0);

  const handleCreated = () => {
    // Could implement cross-component event or state to refresh fault list if needed
    setReloadKey((k) => k + 1);
  };

  return <FaultForm onCreated={handleCreated} key={reloadKey} />;
}
