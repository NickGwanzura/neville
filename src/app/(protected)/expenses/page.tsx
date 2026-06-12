import { getCrmData } from "@/lib/data";
import { DeleteButton } from "../delete-button";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Expenses() {
  const { expenses } = await getCrmData();
  return (
    <>
      <div className="page-header">
        <h2>Expenses & Utilities</h2>
      </div>
      <details className="panel">
        <summary>+ Add Expense</summary>
        <form method="post" action="/api/expenses" className="form-grid">
          <input name="month" placeholder="Month (e.g. 2026-06)" defaultValue="2026-06" />
          <input name="expenseType" placeholder="Expense type" required />
          <input name="supplier" placeholder="Supplier" />
          <select name="currency"><option>USD</option><option>ZiG</option><option>ZWL</option></select>
          <input name="amount" type="number" step="0.01" placeholder="Amount" />
          <select name="status"><option>Due</option><option>Paid</option><option>Overdue</option></select>
          <input name="notes" placeholder="Notes" className="full" />
          <button type="submit" className="full">Add Expense</button>
        </form>
      </details>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Month</th><th>Expense</th><th>Supplier</th><th>Currency</th><th>Amount</th><th>Status</th><th>Notes</th><th></th></tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.month}</td>
                <td><strong>{e.expenseType}</strong></td>
                <td>{e.supplier}</td>
                <td>{e.currency}</td>
                <td><strong>USD {money(e.amount)}</strong></td>
                <td>
                  {e.status === "Paid" ? <span className="badge badge-success">Paid</span> :
                   e.status === "Overdue" ? <span className="badge badge-danger">Overdue</span> :
                   <span className="badge badge-warning">Due</span>}
                </td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{e.notes}</td>
                <td><DeleteButton action={`/api/expenses/${e.id}/delete`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
