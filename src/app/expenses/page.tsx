import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Expenses() {
  const { expenses } = await getCrmData();
  return (
    <>
      <h2>Expenses & Utilities</h2>
      <table>
        <thead>
          <tr><th>Month</th><th>Expense</th><th>Supplier</th><th>Currency</th><th>Amount</th><th>Status</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td>{e.month}</td>
              <td>{e.expenseType}</td>
              <td>{e.supplier}</td>
              <td>{e.currency}</td>
              <td>{money(e.amount)}</td>
              <td>{e.status}</td>
              <td>{e.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
