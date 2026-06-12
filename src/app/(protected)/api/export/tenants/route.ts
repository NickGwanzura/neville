import { getCrmData } from "@/lib/data";
import { toCSV, csvResponse } from "@/lib/csv";

export async function GET() {
  const ctx = await getCrmData();
  const rows = ctx.tenants.map((t) => [
    t.tenantName, t.tradingName, ctx.unitMap[t.unitId] ?? "", t.businessType,
    t.commissionApplicable ? "Yes" : "No", t.commissionRate,
  ]);
  return csvResponse(toCSV(["Tenant", "Trading Name", "Unit", "Business Type", "Commission", "Rate"], rows), "tenants.csv");
}
