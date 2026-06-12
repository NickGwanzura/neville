import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();

  const rentPaid = parseFloat(formData.get("rentPaid") as string) || 0;
  const levyPaid = parseFloat(formData.get("levyPaid") as string) || 0;
  const receiptNumber = (formData.get("receiptNumber") as string) || "";
  const notes = (formData.get("notes") as string) || "";

  const rentRoll = await prisma.rentRoll.findUniqueOrThrow({
    where: { id: parseInt(id) },
    include: { tenant: true, unit: true },
  });

  const commissionAmount = rentRoll.tenant.commissionApplicable
    ? rentPaid * rentRoll.tenant.commissionRate
    : 0;

  await prisma.rentRoll.update({
    where: { id: parseInt(id) },
    data: {
      rentPaid,
      levyPaid,
      receiptNumber,
      notes,
      commissionAmount,
    },
  });

  const to = rentRoll.tenant.email;
  if (to && process.env.RESEND_API_KEY) {
    sendReceiptEmail({
      to,
      tenantName: rentRoll.tenant.tenantName,
      unitName: rentRoll.unit.unitName,
      month: rentRoll.month,
      rentPaid,
      levyPaid,
      receiptNumber,
      commissionAmount,
      notes,
    }).catch((err) => console.error("Email send error:", err));
  }

  redirect("/rent-roll");
}
