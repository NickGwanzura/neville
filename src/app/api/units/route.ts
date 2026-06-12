import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const propertyId = 1;
  await prisma.unit.create({
    data: {
      propertyId,
      unitName: (formData.get("unitName") as string) || "",
      useType: (formData.get("useType") as string) || "",
      status: (formData.get("status") as string) || "Vacant",
      monthlyRent: parseFloat(formData.get("monthlyRent") as string) || 0,
      monthlyLevy: parseFloat(formData.get("monthlyLevy") as string) || 0,
      notes: (formData.get("notes") as string) || "",
    },
  });
  redirect("/units");
}
