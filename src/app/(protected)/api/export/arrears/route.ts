import { getCrmData } from "@/lib/data";
import { toCSV, csvResponse } from "@/lib/csv";

export async function GET() {
  const ctx = await getCrmData();
  const rows = ctx.rentRoll
    .map((r) => ({
      unit: ctx.unitMap[r.unitId] ?? "",
      tenant: ctx.tenantMap[r.tenantId] ?? "",
      rentBal: r.rentDue - r.rentPaid,
      levyBal: r.levyDue - r.levyPaid,
      total: r.rentDue - r.rentPaid + (r.levyDue - r.levyPaid),
      notes: r.notes,
    }))
    .filter((r) => r.total > 0 || r.notes.toLowerCase().includes("reconciliation"))
    .map((r) => [r.unit, r.tenant, r.rentBal, r.levyBal, r.total, r.notes]);
  return csvResponse(toCSV(["Unit", "Tenant", "Rent Balance", "Levy Balance", "Total", "Notes"], rows), "arrears.csv");
}
