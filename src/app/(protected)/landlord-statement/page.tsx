import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function LandlordStatement() {
  const { metrics } = await getCrmData();
  return (
    <>
      <div className="page-header">
        <h2>Landlord Monthly Statement</h2>
      </div>
      <section className="panel" style={{ maxWidth: 600 }}>
        <table style={{ boxShadow: "none" }}>
          <tbody>
            {[
              ["Rent Collected", metrics.rentPaid],
              ["Levies Collected", metrics.levyPaid],
              ["Less Commission", -metrics.commission],
              ["Less Expenses", -metrics.expenses],
            ].map(([label, amount]) => (
              <tr key={label as string}>
                <td style={{ padding: "10px 16px", fontWeight: 500 }}>{label}</td>
                <td style={{ padding: "10px 16px", textAlign: "right" }}>
                  <strong>USD {money(Math.abs(amount as number))}</strong>
                  {(amount as number) < 0 && <span style={{ color: "var(--red)", fontSize: 11, marginLeft: 4 }}>(deduction)</span>}
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: "2px solid var(--blue)" }}>
              <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--blue)" }}>Net Position</td>
              <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, color: "var(--blue)", fontSize: 18 }}>
                USD {money(metrics.netPosition)}
              </td>
            </tr>
            {[
              ["Deposits Held Separately", metrics.deposits],
              ["Arrears Carried Forward", metrics.arrears],
            ].map(([label, amount]) => (
              <tr key={label as string}>
                <td style={{ padding: "10px 16px", color: "var(--muted)" }}>{label}</td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--muted)" }}>USD {money(amount as number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
