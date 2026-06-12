import { getCrmData } from "@/lib/data";

export async function GET() {
  const ctx = await getCrmData();
  const header = "Month,Unit,Tenant,Rent Due,Rent Paid,Rent Balance,Levy Due,Levy Paid,Levy Balance,Commission,Receipt,Notes";
  const rows = ctx.rentRoll.map((r) => {
    const unit = ctx.unitMap[r.unitId] ?? "";
    const tenant = ctx.tenantMap[r.tenantId] ?? "";
    const rentBal = r.rentDue - r.rentPaid;
    const levyBal = r.levyDue - r.levyPaid;
    return `${r.month},"${unit}","${tenant}",${r.rentDue},${r.rentPaid},${rentBal},${r.levyDue},${r.levyPaid},${levyBal},${r.commissionAmount},"${r.receiptNumber}","${r.notes}"`;
  });

  const csv = [header, ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="rent_roll.csv"',
    },
  });
}
