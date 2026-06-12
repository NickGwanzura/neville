import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
    include: { tenant: true },
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

  redirect("/rent-roll");
}
