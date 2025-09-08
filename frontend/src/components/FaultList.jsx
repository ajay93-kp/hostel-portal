export default function FaultList({ faults = [], allowAssign = false, onAssign }) {
  return (
    <div className="card">
      <h3>Faults</h3>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th><th>Hostel</th><th>Floor</th><th>Description</th><th>Category</th><th>Status</th><th>Image</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faults.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.hostel_name}</td>
              <td>{f.floor}</td>
              <td>{f.description}</td>
              <td><span className="badge">{f.predicted_category}</span></td>
              <td>
                <span className={`badge status-${f.status.replaceAll(' ','-')}`}>{f.status}</span>
              </td>
              <td>
                {f.image_path ? <a href={f.image_path} target="_blank">View</a> : "—"}
              </td>
              <td>
                {allowAssign && <button className="btn" onClick={() => onAssign?.(f)}>Assign</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
