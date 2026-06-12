import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const propertyId = 1;
  const unitId = parseInt(formData.get("unitId") as string) || 0;
  const commissionApplicable = formData.get("commissionApplicable") === "on";
  const commissionRate = parseFloat(formData.get("commissionRate") as string) || 0;

  const tenant = await prisma.tenant.create({
    data: {
      propertyId,
      unitId,
      tenantName: (formData.get("tenantName") as string) || "",
      tradingName: (formData.get("tradingName") as string) || "",
      businessType: (formData.get("businessType") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      commissionApplicable,
      commissionRate: commissionApplicable ? commissionRate : 0,
      notes: (formData.get("notes") as string) || "",
    },
  });

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rentDue = parseFloat(formData.get("rentDue") as string) || 0;
  const levyDue = parseFloat(formData.get("levyDue") as string) || 0;
  await prisma.rentRoll.create({
    data: {
      propertyId,
      unitId,
      tenantId: tenant.id,
      month,
      rentDue,
      levyDue,
      commissionRate: commissionApplicable ? commissionRate : 0,
    },
  });

  redirect("/tenants");
}
