import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Arrears() {
  const ctx = await getCrmData();
  const rows = ctx.rentRoll
    .map((r) => ({
      unit: ctx.unitMap[r.unitId] ?? "",
      tenant: ctx.tenantMap[r.tenantId] ?? "",
      rentBalance: r.rentDue - r.rentPaid,
      levyBalance: r.levyDue - r.levyPaid,
      total: r.rentDue - r.rentPaid + (r.levyDue - r.levyPaid),
      notes: r.notes,
    }))
    .filter((r) => r.total > 0 || r.notes.toLowerCase().includes("reconciliation"));

  return (
    <>
      <div className="page-header">
        <h2>Arrears Report</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Unit</th><th>Tenant</th><th>Rent Balance</th><th>Levy Balance</th><th>Total</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {rows.map((a, i) => (
              <tr key={i}>
                <td><strong>{a.unit}</strong></td>
                <td>{a.tenant}</td>
                <td style={{ color: a.rentBalance > 0 ? "var(--red)" : undefined }}>USD {money(a.rentBalance)}</td>
                <td style={{ color: a.levyBalance > 0 ? "var(--red)" : undefined }}>USD {money(a.levyBalance)}</td>
                <td><strong style={{ color: "var(--red)" }}>USD {money(a.total)}</strong></td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{a.notes}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No outstanding arrears</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
