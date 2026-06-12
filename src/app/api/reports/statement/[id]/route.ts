import { prisma } from "@/lib/prisma";
import { generateStatementPdf } from "@/lib/pdf-receipt";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: parseInt(id) },
    include: { unit: true, property: true },
  });

  const entries = await prisma.rentRoll.findMany({
    where: { tenantId: tenant.id },
    orderBy: { month: "asc" },
  });

  const pdf = await generateStatementPdf(
    tenant.property.name,
    tenant.tenantName,
    tenant.unit.unitName,
    entries.map((e) => ({
      month: e.month,
      rentDue: e.rentDue,
      rentPaid: e.rentPaid,
      levyDue: e.levyDue,
      levyPaid: e.levyPaid,
      commission: e.commissionAmount,
      receiptNumber: e.receiptNumber,
      notes: e.notes,
    })),
  );

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="statement-${id}.pdf"`,
    },
  });
}
