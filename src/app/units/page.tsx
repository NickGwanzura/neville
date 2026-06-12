import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Units() {
  const { units } = await getCrmData();
  return (
    <>
      <h2>Units Register</h2>
      <details className="panel" style={{ marginBottom: 16 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--blue)" }}>+ Add Unit</summary>
        <form method="post" action="/api/units" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          <input name="unitName" placeholder="Unit name" required />
          <input name="useType" placeholder="Use type (e.g. Retail)" />
          <select name="status" defaultValue="Vacant">
            <option>Vacant</option><option>Occupied</option><option>Owner Occupied</option><option>Not Ready</option>
          </select>
          <input name="monthlyRent" type="number" step="0.01" placeholder="Monthly rent" />
          <input name="monthlyLevy" type="number" step="0.01" placeholder="Monthly levy" />
          <input name="notes" placeholder="Notes" />
          <button type="submit" style={{ gridColumn: "1 / -1" }}>Add Unit</button>
        </form>
      </details>
      <table>
        <thead>
          <tr><th>Unit</th><th>Use</th><th>Status</th><th>Rent</th><th>Levy</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.id}>
              <td>{u.unitName}</td>
              <td>{u.useType}</td>
              <td><span>{u.status}</span></td>
              <td>USD {money(u.monthlyRent)}</td>
              <td>USD {money(u.monthlyLevy)}</td>
              <td>{u.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
