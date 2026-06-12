import { prisma } from "@/lib/prisma";
import { generateReceiptPdf } from "@/lib/pdf-receipt";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const r = await prisma.rentRoll.findUniqueOrThrow({
    where: { id: parseInt(id) },
    include: { tenant: true, unit: true, property: true },
  });

  const pdf = await generateReceiptPdf({
    receiptNumber: r.receiptNumber,
    tenantName: r.tenant.tenantName,
    unitName: r.unit.unitName,
    month: r.month,
    rentDue: r.rentDue,
    rentPaid: r.rentPaid,
    levyDue: r.levyDue,
    levyPaid: r.levyPaid,
    commissionAmount: r.commissionAmount,
    notes: r.notes,
  });

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt-${id}.pdf"`,
    },
  });
}
