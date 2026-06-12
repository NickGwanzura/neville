import { getCrmData, getUnits } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Maintenance() {
  const { maintenance, unitMap } = await getCrmData();
  const units = await getUnits();
  return (
    <>
      <h2>Maintenance Log</h2>
      <details className="panel" style={{ marginBottom: 16 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--blue)" }}>+ Add Maintenance</summary>
        <form method="post" action="/api/maintenance" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          <select name="unitId">
            <option value="">General</option>
            {units.map((u) => <option key={u.id} value={u.id}>{u.unitName}</option>)}
          </select>
          <input name="issue" placeholder="Issue description" required />
          <select name="priority"><option>Low</option><option selected>Medium</option><option>High</option><option>Critical</option></select>
          <select name="status"><option selected>Open</option><option>In Progress</option><option>Resolved</option></select>
          <input name="estimatedCost" type="number" step="0.01" placeholder="Estimated cost" />
          <input name="notes" placeholder="Notes" />
          <button type="submit" style={{ gridColumn: "1 / -1" }}>Add Maintenance</button>
        </form>
      </details>
      <table>
        <thead>
          <tr><th>Unit</th><th>Issue</th><th>Priority</th><th>Status</th><th>Estimate</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {maintenance.map((m) => (
            <tr key={m.id}>
              <td>{unitMap[m.unitId ?? -1] ?? "General"}</td>
              <td>{m.issue}</td>
              <td>{m.priority}</td>
              <td>{m.status}</td>
              <td>USD {money(m.estimatedCost)}</td>
              <td>{m.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
