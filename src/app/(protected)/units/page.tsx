import { getCrmData } from "@/lib/data";
import { DeleteButton } from "../delete-button";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Units() {
  const { units } = await getCrmData();
  return (
    <>
      <div className="page-header">
        <h2>Units Register</h2>
      </div>
      <details className="panel">
        <summary>+ Add Unit</summary>
        <form method="post" action="/api/units" className="form-grid">
          <input name="unitName" placeholder="Unit name" required />
          <input name="useType" placeholder="Use type (e.g. Retail)" />
          <select name="status" defaultValue="Vacant">
            <option>Vacant</option><option>Occupied</option><option>Owner Occupied</option><option>Not Ready</option>
          </select>
          <input name="monthlyRent" type="number" step="0.01" placeholder="Monthly rent" />
          <input name="monthlyLevy" type="number" step="0.01" placeholder="Monthly levy" />
          <input name="notes" placeholder="Notes" />
          <button type="submit" className="full">Add Unit</button>
        </form>
      </details>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Unit</th><th>Use</th><th>Status</th><th>Rent</th><th>Levy</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.unitName}</strong></td>
                <td>{u.useType}</td>
                <td><span className="badge">{u.status}</span></td>
                <td>USD {money(u.monthlyRent)}</td>
                <td>USD {money(u.monthlyLevy)}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{u.notes}</td>
                <td><DeleteButton action={`/api/units/${u.id}/delete`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
