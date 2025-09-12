import { MdReportProblem } from "react-icons/md";
import { FaList } from "react-icons/fa";
import "../styles/Sidebar.css";

export default function Sidebar({ activePage, onPageChange }) {
  return (
    <nav className="sidebar">
      <ul>
        <li
          className={activePage === "reportFault" ? "active" : ""}
          onClick={() => onPageChange("reportFault")}
          data-label="Report Fault"
        >
          <MdReportProblem style={{ marginRight: 8, verticalAlign: "middle" }} />
          <span className="sidebar-label">Report Fault</span>
        </li>
        <li
          className={activePage === "faults" ? "active" : ""}
          onClick={() => onPageChange("faults")}
          data-label="Faults"
        >
          <FaList style={{ marginRight: 8, verticalAlign: "middle" }} />
          <span className="sidebar-label">Faults</span>
        </li>
      </ul>
    </nav>
  );
}
