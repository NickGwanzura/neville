import { getCrmData, getUnits } from "@/lib/data";
import { DeleteButton } from "../delete-button";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Maintenance() {
  const { maintenance, unitMap } = await getCrmData();
  const units = await getUnits();
  return (
    <>
      <div className="page-header">
        <h2>Maintenance Log</h2>
      </div>
      <details className="panel">
        <summary>+ Add Maintenance</summary>
        <form method="post" action="/api/maintenance" className="form-grid">
          <select name="unitId">
            <option value="">General</option>
            {units.map((u) => <option key={u.id} value={u.id}>{u.unitName}</option>)}
          </select>
          <input name="issue" placeholder="Issue description" required />
          <select name="priority"><option>Low</option><option selected>Medium</option><option>High</option><option>Critical</option></select>
          <select name="status"><option selected>Open</option><option>In Progress</option><option>Resolved</option></select>
          <input name="estimatedCost" type="number" step="0.01" placeholder="Estimated cost" />
          <input name="notes" placeholder="Notes" />
          <button type="submit" className="full">Add Maintenance</button>
        </form>
      </details>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Unit</th><th>Issue</th><th>Priority</th><th>Status</th><th>Estimate</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {maintenance.map((m) => (
              <tr key={m.id}>
                <td>{unitMap[m.unitId ?? -1] ?? "General"}</td>
                <td><strong>{m.issue}</strong></td>
                <td>
                  {m.priority === "Critical" ? <span className="badge badge-danger">Critical</span> :
                   m.priority === "High" ? <span className="badge badge-warning">High</span> :
                   m.priority === "Low" ? <span className="badge">Low</span> :
                   <span className="badge">Medium</span>}
                </td>
                <td>
                  {m.status === "Resolved" ? <span className="badge badge-success">Resolved</span> :
                   m.status === "In Progress" ? <span className="badge badge-warning">In Progress</span> :
                   <span className="badge badge-danger">Open</span>}
                </td>
                <td>USD {money(m.estimatedCost)}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.notes}</td>
                <td><DeleteButton action={`/api/maintenance/${m.id}/delete`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
