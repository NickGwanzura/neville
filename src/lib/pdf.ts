import PDFDocument from "pdfkit";

export function generatePdf(
  title: string,
  rows: [string, string][],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).font("Helvetica-Bold").text("Hilton Properties CRM", { align: "center" });
    doc.fontSize(14).text(title, { align: "center" });
    doc.moveDown(1.5);

    const tableTop = doc.y;
    const col1 = 40;
    const col2 = 300;
    const pageWidth = doc.page.width - 80;

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Item", col1, tableTop);
    doc.text("Value", col2, tableTop);

    doc.moveTo(col1, tableTop + 15).lineTo(col1 + pageWidth, tableTop + 15).stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(9);
    let y = doc.y;
    for (const [label, value] of rows) {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }
      doc.text(label, col1, y, { width: 250 });
      doc.text(value, col2, y, { width: 250 });
      y += 18;
    }

    doc.moveTo(col1, y).lineTo(col1 + pageWidth, y).stroke();
    doc.end();
  });
}

export function pdfResponse(buffer: Buffer, filename: string): Response {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
