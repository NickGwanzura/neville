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
      <h2>Arrears Report</h2>
      <table>
        <thead>
          <tr><th>Unit</th><th>Tenant</th><th>Rent Balance</th><th>Levy Balance</th><th>Total</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {rows.map((a, i) => (
            <tr key={i}>
              <td>{a.unit}</td>
              <td>{a.tenant}</td>
              <td>USD {money(a.rentBalance)}</td>
              <td>USD {money(a.levyBalance)}</td>
              <td><strong>USD {money(a.total)}</strong></td>
              <td>{a.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
