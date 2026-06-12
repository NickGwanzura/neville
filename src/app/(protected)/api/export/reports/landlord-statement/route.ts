import { NextResponse } from "next/server";
import { getCrmData } from "@/lib/data";
import { generatePdf, pdfResponse } from "@/lib/pdf";

export async function GET() {
  try {
    const { property, month, metrics } = await getCrmData();
    const rows: [string, string][] = [
      ["Property", property.name],
      ["Address", property.address],
      ["Manager", property.manager],
      ["Month", month],
      ["", ""],
      ["Rent Collected", `USD ${metrics.rentPaid.toFixed(2)}`],
      ["Levies Collected", `USD ${metrics.levyPaid.toFixed(2)}`],
      ["Less Commission", `USD ${metrics.commission.toFixed(2)}`],
      ["Less Expenses", `USD ${metrics.expenses.toFixed(2)}`],
      ["Net Position", `USD ${metrics.netPosition.toFixed(2)}`],
      ["Deposits Held", `USD ${metrics.deposits.toFixed(2)}`],
      ["Arrears", `USD ${metrics.arrears.toFixed(2)}`],
      ["", ""],
      ["Occupancy Rate", `${metrics.occupancyRate}%`],
      ["Total Units", String(metrics.totalUnits)],
      ["Occupied", String(metrics.occupied)],
      ["Vacant", String(metrics.vacant)],
    ];
    const pdf = await generatePdf("Landlord Monthly Statement", rows);
    return pdfResponse(pdf, "landlord-statement.pdf");
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err instanceof Error ? err.message : "PDF generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
