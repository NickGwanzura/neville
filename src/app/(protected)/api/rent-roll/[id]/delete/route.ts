import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.rentRoll.delete({ where: { id: parseInt(id) } });
  redirect("/rent-roll");
}
