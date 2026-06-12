import { NextResponse } from "next/server";
import { getCrmData } from "@/lib/data";
import { generateLeaseReviewPdf } from "@/lib/pdf-receipt";

export async function GET() {
  try {
    const { leaseReviews, maintenance, unitMap } = await getCrmData();
    const pdf = await generateLeaseReviewPdf(leaseReviews, maintenance, unitMap);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="lease-reviews.pdf"',
        "Content-Length": String(pdf.byteLength),
      },
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: err instanceof Error ? err.message : "PDF generation failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
