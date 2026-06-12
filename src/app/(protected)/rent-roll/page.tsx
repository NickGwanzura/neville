import { getCrmData, getUnits } from "@/lib/data";
import { DeleteButton } from "../delete-button";

function money(v: number) {
  return v.toFixed(2);
}

function balanceColor(bal: number) {
  return bal > 0 ? "var(--red)" : "var(--green)";
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
        <summary>+ Add Entry</summary>
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
              <th>Unit</th>
              <th>Tenant</th>
              <th>Rent</th>
              <th>Levy</th>
              <th style={{ textAlign: "center" }}>Balance</th>
              <th>Commission</th>
              <th>Receipt</th>
              <th>Docs</th>
              <th style={{ textAlign: "center" }}>Update</th>
            </tr>
          </thead>
          <tbody>
            {rentRoll.map((r) => {
              const rentBal = r.rentDue - r.rentPaid;
              const levyBal = r.levyDue - r.levyPaid;
              const totalBal = rentBal + levyBal;
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{unitMap[r.unitId] ?? ""}</td>
                  <td><strong>{tenantMap[r.tenantId] ?? ""}</strong></td>
                  <td style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <div>Due: <strong>{money(r.rentDue)}</strong></div>
                    <div>Paid: <span style={{ color: r.rentPaid > 0 ? "var(--green)" : undefined }}>{money(r.rentPaid)}</span></div>
                    <div style={{ color: balanceColor(rentBal), fontWeight: 600 }}>Bal: {money(rentBal)}</div>
                  </td>
                  <td style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <div>Due: <strong>{money(r.levyDue)}</strong></div>
                    <div>Paid: <span style={{ color: r.levyPaid > 0 ? "var(--green)" : undefined }}>{money(r.levyPaid)}</span></div>
                    <div style={{ color: balanceColor(levyBal), fontWeight: 600 }}>Bal: {money(levyBal)}</div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: totalBal > 0 ? "white" : "white",
                      background: totalBal > 0 ? "var(--red)" : "var(--green)",
                    }}>
                      USD {money(totalBal)}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>{money(r.commissionAmount)}</td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{r.receiptNumber || "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <a href={`/api/reports/invoice/${r.id}`} className="btn btn-ghost" style={{ fontSize: 11, padding: "3px 8px", marginRight: 5 }}>Inv</a>
                    <a href={`/api/reports/receipt/${r.id}`} className="btn btn-ghost" style={{ fontSize: 11, padding: "3px 8px" }}>Rec</a>
                  </td>
                  <td>
                    <div className="action-cell" style={{ justifyContent: "center" }}>
                      <form method="post" action={`/rent-roll/${r.id}/update`} style={{
                        display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap",
                      }}>
                        <input name="rentPaid" defaultValue={r.rentPaid} type="number" step="0.01"
                          style={{ width: 68, padding: "5px 6px", fontSize: 11 }} placeholder="$" />
                        <input name="levyPaid" defaultValue={r.levyPaid} type="number" step="0.01"
                          style={{ width: 60, padding: "5px 6px", fontSize: 11 }} placeholder="L" />
                        <input name="receiptNumber" defaultValue={r.receiptNumber}
                          style={{ width: 80, padding: "5px 6px", fontSize: 11 }} placeholder="Ref" />
                        <button style={{ padding: "5px 10px", fontSize: 11 }}>Save</button>
                      </form>
                      <DeleteButton action={`/api/rent-roll/${r.id}/delete`} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {rentRoll.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No rent roll entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
