import { getCrmData, getUnits } from "@/lib/data";
import { DeleteButton } from "../delete-button";

export default async function Tenants() {
  const { tenants, unitMap } = await getCrmData();
  const units = await getUnits();
  return (
    <>
      <div className="page-header">
        <h2>Tenant Database</h2>
      </div>
      <details className="panel">
        <summary>+ Add Tenant</summary>
        <form method="post" action="/api/tenants" className="form-grid">
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
          <button type="submit" className="full">Add Tenant</button>
        </form>
      </details>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Tenant</th><th>Trading Name</th><th>Unit</th><th>Business Type</th><th>Commission</th><th>Rate</th><th>Statement</th><th></th></tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id}>
                <td><strong>{t.tenantName}</strong></td>
                <td>{t.tradingName}</td>
                <td>{unitMap[t.unitId] ?? ""}</td>
                <td>{t.businessType}</td>
                <td>{t.commissionApplicable ? <span className="badge badge-success">Yes</span> : <span className="badge">No</span>}</td>
                <td>{Math.round(t.commissionRate * 100)}%</td>
                <td><a href={`/api/reports/statement/${t.id}`} className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }}>PDF</a></td>
                <td><DeleteButton action={`/api/tenants/${t.id}/delete`} label="Delete" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
