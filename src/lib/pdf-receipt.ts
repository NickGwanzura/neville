import PDFDocument from "pdfkit";

export function generateReceiptPdf(params: {
  receiptNumber: string;
  tenantName: string;
  unitName: string;
  propertyName: string;
  month: string;
  rentDue: number;
  rentPaid: number;
  levyDue: number;
  levyPaid: number;
  commissionAmount: number;
  notes: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const totalPaid = params.rentPaid + params.levyPaid - params.commissionAmount;
    const rentBal = params.rentDue - params.rentPaid;
    const levyBal = params.levyDue - params.levyPaid;

    doc.fontSize(22).font("Helvetica-Bold").text("RECEIPT", { align: "center" });
    doc.fontSize(10).font("Helvetica").text(params.propertyName, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor("#666").text(`Receipt #${params.receiptNumber || "N/A"} · ${params.month}`, { align: "center" });
    doc.fillColor("#000").moveDown(1.5);

    const leftX = 50;
    const rightX = 300;
    let y = doc.y;

    const field = (label: string, value: string, x: number) => {
      doc.fontSize(9).font("Helvetica-Bold").text(label, x, y);
      doc.font("Helvetica").text(value, x + 110, y);
      y += 16;
    };

    field("Tenant:", params.tenantName, leftX);
    field("Unit:", params.unitName, leftX);
    field("Month:", params.month, leftX);

    y += 10;
    doc.moveTo(leftX, y).lineTo(545, y).stroke();
    y += 14;

    field("Rent Due:", `USD ${params.rentDue.toFixed(2)}`, leftX);
    field("Rent Paid:", `USD ${params.rentPaid.toFixed(2)}`, leftX);
    field("Rent Balance:", `USD ${rentBal.toFixed(2)}`, leftX);
    y += 4;
    field("Levy Due:", `USD ${params.levyDue.toFixed(2)}`, leftX);
    field("Levy Paid:", `USD ${params.levyPaid.toFixed(2)}`, leftX);
    field("Levy Balance:", `USD ${levyBal.toFixed(2)}`, leftX);

    y += 4;
    field("Commission:", `USD ${params.commissionAmount.toFixed(2)}`, leftX);

    y += 6;
    doc.moveTo(leftX, y).lineTo(545, y).stroke();
    y += 14;

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Total Credited:", leftX, y);
    doc.text(`USD ${totalPaid.toFixed(2)}`, rightX, y);

    y += 22;
    doc.font("Helvetica").fontSize(9);
    doc.text("Notes:", leftX, y);
    doc.text(params.notes || "—", leftX, y + 14);

    doc.end();
  });
}

export function generateInvoicePdf(params: {
  tenantName: string;
  unitName: string;
  propertyName: string;
  month: string;
  rentDue: number;
  levyDue: number;
  commissionRate: number;
  notes: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).font("Helvetica-Bold").text("INVOICE", { align: "center" });
    doc.fontSize(10).font("Helvetica").text(params.propertyName, { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor("#666").text(params.month, { align: "center" });
    doc.fillColor("#000").moveDown(1.5);

    let y = doc.y;
    const leftX = 50;

    const line = (label: string, value: string) => {
      doc.fontSize(9).font("Helvetica-Bold").text(label, leftX, y);
      doc.font("Helvetica").text(value, leftX + 140, y);
      y += 16;
    };

    line("Tenant:", params.tenantName);
    line("Unit:", params.unitName);
    line("Month:", params.month);

    y += 10;
    doc.moveTo(leftX, y).lineTo(545, y).stroke();
    y += 14;

    line("Rent Due:", `USD ${params.rentDue.toFixed(2)}`);
    line("Levy Due:", `USD ${params.levyDue.toFixed(2)}`);

    if (params.commissionRate > 0) {
      line("Commission Rate:", `${(params.commissionRate * 100).toFixed(0)}%`);
    }

    const total = params.rentDue + params.levyDue;
    y += 6;
    doc.moveTo(leftX, y).lineTo(545, y).stroke();
    y += 14;

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Total Due:", leftX, y);
    doc.text(`USD ${total.toFixed(2)}`, 300, y);

    y += 22;
    doc.font("Helvetica").fontSize(9);
    doc.text("Notes:", leftX, y);
    doc.text(params.notes || "—", leftX, y + 14);

    doc.end();
  });
}

export function generateStatementPdf(
  propertyName: string,
  tenantName: string,
  unitName: string,
  entries: { month: string; rentDue: number; rentPaid: number; levyDue: number; levyPaid: number; commission: number; receiptNumber: string; notes: string }[],
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font("Helvetica-Bold").text("TENANT STATEMENT", { align: "center" });
    doc.fontSize(10).font("Helvetica").text(propertyName, { align: "center" });
    doc.moveDown(1.2);
    doc.fontSize(10).text(`Tenant: ${tenantName}`, { align: "center" });
    doc.fontSize(10).text(`Unit: ${unitName}`, { align: "center" });
    doc.moveDown(1.5);

    const col = (x: number, w: number, text: string, bold = false) => {
      doc.font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(8).text(text, x, doc.y, { width: w });
    };

    const cols = [50, 120, 190, 260, 330, 400, 470];
    const headers = ["Month", "Rent Due", "Rent Paid", "Levy Due", "Levy Paid", "Commission", "Receipt"];
    let y = doc.y;

    doc.font("Helvetica-Bold").fontSize(8);
    headers.forEach((h, i) => col(cols[i], 65, h));
    y = doc.y + 4;
    doc.moveTo(50, y - 2).lineTo(545, y - 2).stroke();
    doc.font("Helvetica").fontSize(8);

    let totalRentDue = 0, totalRentPaid = 0, totalLevyDue = 0, totalLevyPaid = 0, totalCommission = 0;

    for (const e of entries) {
      if (y > doc.page.height - 50) { doc.addPage(); y = 40; doc.font("Helvetica").fontSize(8); }
      doc.y = y;
      col(cols[0], 65, e.month);
      col(cols[1], 65, e.rentDue.toFixed(2));
      col(cols[2], 65, e.rentPaid.toFixed(2));
      col(cols[3], 65, e.levyDue.toFixed(2));
      col(cols[4], 65, e.levyPaid.toFixed(2));
      col(cols[5], 65, e.commission.toFixed(2));
      col(cols[6], 65, e.receiptNumber || "—");
      y = doc.y + 12;
      totalRentDue += e.rentDue;
      totalRentPaid += e.rentPaid;
      totalLevyDue += e.levyDue;
      totalLevyPaid += e.levyPaid;
      totalCommission += e.commission;
    }

    y += 6;
    doc.y = y;
    doc.moveTo(50, y).lineTo(545, y).stroke();
    y += 4;
    doc.y = y;
    doc.font("Helvetica-Bold").fontSize(9);
    col(cols[0], 65, "TOTALS", true);
    col(cols[1], 65, totalRentDue.toFixed(2), true);
    col(cols[2], 65, totalRentPaid.toFixed(2), true);
    col(cols[3], 65, totalLevyDue.toFixed(2), true);
    col(cols[4], 65, totalLevyPaid.toFixed(2), true);
    col(cols[5], 65, totalCommission.toFixed(2), true);

    const balance = totalRentDue - totalRentPaid + totalLevyDue - totalLevyPaid;
    y = doc.y + 18;
    doc.y = y;
    doc.fontSize(11).text(`Outstanding Balance: USD ${balance.toFixed(2)}`, 50, y);

    doc.end();
  });
}
