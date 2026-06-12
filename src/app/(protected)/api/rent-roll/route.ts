import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const propertyId = 1;
  const unitId = parseInt(formData.get("unitId") as string) || 0;
  const tenantId = parseInt(formData.get("tenantId") as string) || 0;
  const rentDue = parseFloat(formData.get("rentDue") as string) || 0;
  const levyDue = parseFloat(formData.get("levyDue") as string) || 0;

  const tenant = await prisma.tenant.findUniqueOrThrow({ where: { id: tenantId } });

  await prisma.rentRoll.create({
    data: {
      propertyId,
      unitId,
      tenantId,
      month: (formData.get("month") as string) || "",
      rentDue,
      levyDue,
      commissionRate: tenant.commissionApplicable ? tenant.commissionRate : 0,
      commissionAmount: tenant.commissionApplicable ? rentDue * tenant.commissionRate : 0,
      notes: (formData.get("notes") as string) || "",
    },
  });
  redirect("/rent-roll");
}
