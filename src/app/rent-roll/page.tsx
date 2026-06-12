import { getCrmData, getUnits } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function RentRollPage() {
  const { rentRoll, unitMap, tenantMap, tenants } = await getCrmData();
  const units = await getUnits();
  return (
    <>
      <h2>Monthly Rent Roll</h2>
      <details className="panel" style={{ marginBottom: 16 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--blue)" }}>+ Add Rent Roll Entry</summary>
        <form method="post" action="/api/rent-roll" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          <input name="month" type="month" defaultValue="2026-06" required />
          <select name="unitId" required>
            <option value="">Unit</option>
            {units.map((u) => <option key={u.id} value={u.id}>{u.unitName}</option>)}
          </select>
          <select name="tenantId" required>
            <option value="">Tenant</option>
            {tenants.map((t) => <option key={t.id} value={t.id}>{t.tenantName}</option>)}
          </select>
          <input name="rentDue" type="number" step="0.01" placeholder="Rent due" />
          <input name="levyDue" type="number" step="0.01" placeholder="Levy due" />
          <input name="notes" placeholder="Notes" style={{ gridColumn: "1 / -1" }} />
          <button type="submit" style={{ gridColumn: "1 / -1" }}>Add Entry</button>
        </form>
      </details>
      <table>
        <thead>
          <tr>
            <th>Unit</th><th>Tenant</th><th>Rent Due</th><th>Rent Paid</th><th>Rent Bal.</th>
            <th>Levy Due</th><th>Levy Paid</th><th>Levy Bal.</th><th>Commission</th><th>Receipt</th><th>Update</th>
          </tr>
        </thead>
        <tbody>
          {rentRoll.map((r) => (
            <tr key={r.id}>
              <td>{unitMap[r.unitId] ?? ""}</td>
              <td>{tenantMap[r.tenantId] ?? ""}</td>
              <td>{money(r.rentDue)}</td>
              <td>{money(r.rentPaid)}</td>
              <td>{money(r.rentDue - r.rentPaid)}</td>
              <td>{money(r.levyDue)}</td>
              <td>{money(r.levyPaid)}</td>
              <td>{money(r.levyDue - r.levyPaid)}</td>
              <td>{money(r.commissionAmount)}</td>
              <td>{r.receiptNumber}</td>
              <td>
                <form method="post" action={`/rent-roll/${r.id}/update`} className="inline-form">
                  <input name="rentPaid" defaultValue={r.rentPaid} type="number" step="0.01" />
                  <input name="levyPaid" defaultValue={r.levyPaid} type="number" step="0.01" />
                  <input name="receiptNumber" defaultValue={r.receiptNumber} />
                  <input name="notes" defaultValue={r.notes} />
                  <button>Save</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
