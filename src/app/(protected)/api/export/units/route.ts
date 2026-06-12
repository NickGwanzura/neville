import { getCrmData } from "@/lib/data";
import { toCSV, csvResponse } from "@/lib/csv";

export async function GET() {
  const { units } = await getCrmData();
  const rows = units.map((u) => [u.unitName, u.useType, u.status, u.monthlyRent, u.monthlyLevy, u.notes]);
  return csvResponse(toCSV(["Unit", "Use", "Status", "Rent", "Levy", "Notes"], rows), "units.csv");
}
