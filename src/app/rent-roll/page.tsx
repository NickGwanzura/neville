import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function RentRollPage() {
  const { rentRoll, unitMap, tenantMap } = await getCrmData();
  return (
    <>
      <h2>Monthly Rent Roll</h2>
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
