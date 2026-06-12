import { getCrmData } from "@/lib/data";
import { DeleteButton } from "../delete-button";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Expenses() {
  const { expenses } = await getCrmData();
  return (
    <>
      <h2>Expenses & Utilities</h2>
      <details className="panel" style={{ marginBottom: 16 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--blue)" }}>+ Add Expense</summary>
        <form method="post" action="/api/expenses" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 12 }}>
          <input name="month" placeholder="Month (e.g. 2026-06)" defaultValue="2026-06" />
          <input name="expenseType" placeholder="Expense type" required />
          <input name="supplier" placeholder="Supplier" />
          <select name="currency"><option>USD</option><option>ZiG</option><option>ZWL</option></select>
          <input name="amount" type="number" step="0.01" placeholder="Amount" />
          <select name="status"><option>Due</option><option>Paid</option><option>Overdue</option></select>
          <input name="notes" placeholder="Notes" style={{ gridColumn: "1 / -1" }} />
          <button type="submit" style={{ gridColumn: "1 / -1" }}>Add Expense</button>
        </form>
      </details>
      <table>
        <thead>
          <tr><th>Month</th><th>Expense</th><th>Supplier</th><th>Currency</th><th>Amount</th><th>Status</th><th>Notes</th><th></th></tr>
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
              <td><DeleteButton action={`/api/expenses/${e.id}/delete`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
