import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const propertyId = 1;
  const unitId = parseInt(formData.get("unitId") as string) || undefined;
  await prisma.maintenanceLog.create({
    data: {
      propertyId,
      unitId: unitId || null,
      issue: (formData.get("issue") as string) || "",
      priority: (formData.get("priority") as string) || "Medium",
      status: (formData.get("status") as string) || "Open",
      estimatedCost: parseFloat(formData.get("estimatedCost") as string) || 0,
      notes: (formData.get("notes") as string) || "",
    },
  });
  redirect("/maintenance");
}
