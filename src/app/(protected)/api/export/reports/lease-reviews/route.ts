import { NextResponse } from "next/server";
import { getCrmData } from "@/lib/data";
import { generateLeaseReviewPdf } from "@/lib/pdf-receipt";

export async function GET() {
  const { leaseReviews, maintenance, unitMap } = await getCrmData();
  const pdf = await generateLeaseReviewPdf(leaseReviews, maintenance, unitMap);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="lease-reviews.pdf"',
    },
  });
}
