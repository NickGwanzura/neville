import { getCrmData, getUnits } from "@/lib/data";

export default async function Tenants() {
  const { tenants, unitMap } = await getCrmData();
  const units = await getUnits();
  return (
    <>
      <h2>Tenant Database</h2>
      <details className="panel" style={{ marginBottom: 16 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--blue)" }}>+ Add Tenant</summary>
        <form method="post" action="/api/tenants" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          <input name="tenantName" placeholder="Tenant name" required />
          <input name="tradingName" placeholder="Trading name" />
          <select name="unitId" required>
            <option value="">Select unit</option>
            {units.map((u) => <option key={u.id} value={u.id}>{u.unitName}</option>)}
          </select>
          <input name="businessType" placeholder="Business type" />
          <input name="phone" placeholder="Phone" />
          <input name="email" placeholder="Email" type="email" />
          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <input name="commissionApplicable" type="checkbox" defaultChecked /> Commission applies
          </label>
          <input name="commissionRate" type="number" step="0.01" defaultValue="0.10" placeholder="Rate (e.g. 0.10)" />
          <input name="rentDue" type="number" step="0.01" placeholder="Monthly rent due" />
          <input name="levyDue" type="number" step="0.01" placeholder="Monthly levy due" />
          <input name="notes" placeholder="Notes" />
          <button type="submit" style={{ gridColumn: "1 / -1" }}>Add Tenant</button>
        </form>
      </details>
      <table>
        <thead>
          <tr><th>Tenant</th><th>Trading Name</th><th>Unit</th><th>Business Type</th><th>Commission</th><th>Rate</th><th>Statement</th></tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.tenantName}</td>
              <td>{t.tradingName}</td>
              <td>{unitMap[t.unitId] ?? ""}</td>
              <td>{t.businessType}</td>
              <td>{t.commissionApplicable ? "Yes" : "No"}</td>
              <td>{Math.round(t.commissionRate * 100)}%</td>
              <td><a href={`/api/reports/statement/${t.id}`} style={{ fontSize: 12 }}>PDF</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
