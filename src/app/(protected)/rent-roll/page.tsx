import { getCrmData, getUnits } from "@/lib/data";
import { DeleteButton } from "../delete-button";

function money(v: number) {
  return v.toFixed(2);
}

export default async function RentRollPage() {
  const { rentRoll, unitMap, tenantMap, tenants } = await getCrmData();
  const units = await getUnits();
  return (
    <>
      <div className="page-header">
        <h2>Monthly Rent Roll</h2>
      </div>
      <details className="panel">
        <summary>+ Add Rent Roll Entry</summary>
        <form method="post" action="/api/rent-roll" className="form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
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
          <input name="notes" placeholder="Notes" className="full" />
          <button type="submit" className="full">Add Entry</button>
        </form>
      </details>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Unit</th><th>Tenant</th><th>Rent Due</th><th>Rent Paid</th><th>Bal.</th>
              <th>Levy Due</th><th>Levy Paid</th><th>Bal.</th><th>Commission</th><th>Receipt</th><th>Docs</th><th>Update</th>
            </tr>
          </thead>
          <tbody>
            {rentRoll.map((r) => (
              <tr key={r.id}>
                <td>{unitMap[r.unitId] ?? ""}</td>
                <td><strong>{tenantMap[r.tenantId] ?? ""}</strong></td>
                <td>{money(r.rentDue)}</td>
                <td>{money(r.rentPaid)}</td>
                <td style={{ fontWeight: r.rentDue - r.rentPaid > 0 ? 600 : 400 }}>{money(r.rentDue - r.rentPaid)}</td>
                <td>{money(r.levyDue)}</td>
                <td>{money(r.levyPaid)}</td>
                <td style={{ fontWeight: r.levyDue - r.levyPaid > 0 ? 600 : 400 }}>{money(r.levyDue - r.levyPaid)}</td>
                <td>{money(r.commissionAmount)}</td>
                <td style={{ fontSize: 12 }}>{r.receiptNumber || "—"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <a href={`/api/reports/invoice/${r.id}`} className="btn btn-ghost" style={{ fontSize: 11, padding: "3px 8px", marginRight: 4 }}>Invoice</a>
                  <a href={`/api/reports/receipt/${r.id}`} className="btn btn-ghost" style={{ fontSize: 11, padding: "3px 8px" }}>Receipt</a>
                </td>
                <td>
                  <div className="action-cell">
                    <form method="post" action={`/rent-roll/${r.id}/update`} className="inline-form">
                      <input name="rentPaid" defaultValue={r.rentPaid} type="number" step="0.01" placeholder="Paid" />
                      <input name="levyPaid" defaultValue={r.levyPaid} type="number" step="0.01" placeholder="Levy" />
                      <input name="receiptNumber" defaultValue={r.receiptNumber} placeholder="Receipt" style={{ width: 100 }} />
                      <input name="notes" defaultValue={r.notes} placeholder="Notes" style={{ width: 120 }} />
                      <button style={{ padding: "6px 10px", fontSize: 12 }}>Save</button>
                    </form>
                    <DeleteButton action={`/api/rent-roll/${r.id}/delete`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
