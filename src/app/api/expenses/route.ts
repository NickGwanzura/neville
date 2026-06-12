import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const propertyId = 1;
  await prisma.expense.create({
    data: {
      propertyId,
      month: (formData.get("month") as string) || "2026-06",
      expenseType: (formData.get("expenseType") as string) || "",
      supplier: (formData.get("supplier") as string) || "",
      currency: (formData.get("currency") as string) || "USD",
      amount: parseFloat(formData.get("amount") as string) || 0,
      status: (formData.get("status") as string) || "Due",
      notes: (formData.get("notes") as string) || "",
    },
  });
  redirect("/expenses");
}
