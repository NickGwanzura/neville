import { getCrmData } from "@/lib/data";
import { generatePdf, pdfResponse } from "@/lib/pdf";

export async function GET() {
  const ctx = await getCrmData();
  const arrears = ctx.rentRoll
    .map((r) => ({
      unit: ctx.unitMap[r.unitId] ?? "",
      tenant: ctx.tenantMap[r.tenantId] ?? "",
      total: r.rentDue - r.rentPaid + (r.levyDue - r.levyPaid),
    }))
    .filter((r) => r.total > 0);

  const rows: [string, string][] = arrears.map((a) => [`${a.unit} - ${a.tenant}`, `USD ${a.total.toFixed(2)}`]);
  rows.unshift(["", ""], ["Total Arrears", `USD ${arrears.reduce((s, a) => s + a.total, 0).toFixed(2)}`]);

  const pdf = await generatePdf("Arrears Report", rows);
  return pdfResponse(pdf, "arrears.pdf");
}
