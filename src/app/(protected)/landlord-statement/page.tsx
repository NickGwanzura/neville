import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function LandlordStatement() {
  const { metrics } = await getCrmData();
  return (
    <>
      <h2>Landlord Monthly Statement</h2>
      <section className="panel">
        <table>
          <tbody>
            <tr><td>Rent Collected</td><td>USD {money(metrics.rentPaid)}</td></tr>
            <tr><td>Levies Collected</td><td>USD {money(metrics.levyPaid)}</td></tr>
            <tr><td>Less Commission</td><td>USD {money(metrics.commission)}</td></tr>
            <tr><td>Less Expenses</td><td>USD {money(metrics.expenses)}</td></tr>
            <tr><td><strong>Net Position</strong></td><td><strong>USD {money(metrics.netPosition)}</strong></td></tr>
            <tr><td>Deposits Held Separately</td><td>USD {money(metrics.deposits)}</td></tr>
            <tr><td>Arrears Carried Forward</td><td>USD {money(metrics.arrears)}</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
