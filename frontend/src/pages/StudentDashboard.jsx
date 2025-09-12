import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ReportFault from "./ReportFault";
import FaultsPage from "./FaultsPage";
import "../styles/StudentDashboard.css";

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("reportFault"); // default page

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div className="student-dashboard">
      <Sidebar activePage={activePage} onPageChange={handlePageChange} />
      <main className="dashboard-content">
        {activePage === "reportFault" && <ReportFault />}
        {activePage === "faults" && <FaultsPage />}
      </main>
    </div>
  );
}
