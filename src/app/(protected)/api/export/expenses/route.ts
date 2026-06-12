import { getCrmData } from "@/lib/data";
import { toCSV, csvResponse } from "@/lib/csv";

export async function GET() {
  const { expenses } = await getCrmData();
  const rows = expenses.map((e) => [e.month, e.expenseType, e.supplier, e.currency, e.amount, e.status, e.notes]);
  return csvResponse(toCSV(["Month", "Expense", "Supplier", "Currency", "Amount", "Status", "Notes"], rows), "expenses.csv");
}
