import { getCrmData } from "@/lib/data";

export default async function Tenants() {
  const { tenants, unitMap } = await getCrmData();
  return (
    <>
      <h2>Tenant Database</h2>
      <table>
        <thead>
          <tr><th>Tenant</th><th>Trading Name</th><th>Unit</th><th>Business Type</th><th>Commission</th><th>Rate</th></tr>
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
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
