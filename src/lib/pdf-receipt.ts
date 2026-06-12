import PDFDocument from "pdfkit";
import { prisma } from "./prisma";

async function getCompany() {
  const c = await prisma.companySettings.findFirst();
  return c || {
    companyName: "Hilton Properties",
    tagline: "Premier Property Management Platform",
    address: "",
    phone: "",
    email: "",
    website: "",
    footer: "Thank you for your business",
  };
}

export async function generateReceiptPdf(params: {
  receiptNumber: string;
  tenantName: string;
  unitName: string;
  month: string;
  rentDue: number;
  rentPaid: number;
  levyDue: number;
  levyPaid: number;
  commissionAmount: number;
  notes: string;
}): Promise<Buffer> {
  const company = await getCompany();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const totalPaid = params.rentPaid + params.levyPaid - params.commissionAmount;
    const rentBal = params.rentDue - params.rentPaid;
    const levyBal = params.levyDue - params.levyPaid;

    doc.fontSize(22).font("Helvetica-Bold").text(company.companyName, { align: "center" });
    doc.fontSize(9).font("Helvetica").fillColor("#666").text(company.tagline, { align: "center" });
    doc.fillColor("#000").moveDown(0.5);
    doc.fontSize(18).text("RECEIPT", { align: "center" });
    doc.fontSize(9).fillColor("#666").text(`Receipt #${params.receiptNumber || "N/A"} · ${params.month}`, { align: "center" });
    if (company.address) doc.fontSize(8).text(company.address, { align: "center" });
    doc.fillColor("#000").moveDown(1.5);

    const leftX = 50;
    let y = doc.y;

    const field = (label: string, value: string) => {
      doc.fontSize(9).font("Helvetica-Bold").text(label, leftX, y);
      doc.font("Helvetica").text(value, leftX + 110, y);
      y += 16;
    };

    field("Tenant:", params.tenantName);
    field("Unit:", params.unitName);
    field("Month:", params.month);

    y += 10;
    doc.moveTo(leftX, y).lineTo(545, y).stroke();
    y += 14;

    field("Rent Due:", `USD ${params.rentDue.toFixed(2)}`);
    field("Rent Paid:", `USD ${params.rentPaid.toFixed(2)}`);
    field("Rent Balance:", `USD ${rentBal.toFixed(2)}`);
    y += 4;
    field("Levy Due:", `USD ${params.levyDue.toFixed(2)}`);
    field("Levy Paid:", `USD ${params.levyPaid.toFixed(2)}`);
    field("Levy Balance:", `USD ${levyBal.toFixed(2)}`);
    y += 4;
    field("Commission:", `USD ${params.commissionAmount.toFixed(2)}`);

    y += 6;
    doc.moveTo(leftX, y).lineTo(545, y).stroke();
    y += 14;
    doc.font("Helvetica-Bold").fontSize(11);
    doc.text("Total Credited:", leftX, y);
    doc.text(`USD ${totalPaid.toFixed(2)}`, 300, y);

    y += 22;
    doc.font("Helvetica").fontSize(9);
    doc.text("Notes:", leftX, y);
    doc.text(params.notes || "—", leftX, y + 14);

    const fy = doc.page.height - 40;
    doc.fontSize(7).fillColor("#999").text(company.footer, 50, fy, { align: "center" });
    if (company.phone || company.email) doc.text([company.phone, company.email].filter(Boolean).join("  ·  "), 50, fy + 10, { align: "center" });

    doc.end();
  });
}

export async function generateInvoicePdf(params: {
  tenantName: string;
  unitName: string;
  month: string;
  rentDue: number;
  levyDue: number;
  commissionRate: number;
  notes: string;
}): Promise<Buffer> {
  const company = await getCompany();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).font("Helvetica-Bold").text(company.companyName, { align: "center" });
    doc.fontSize(9).font("Helvetica").fillColor("#666").text(company.tagline, { align: "center" });
    if (company.address) doc.fontSize(8).text(company.address, { align: "center" });
    doc.fillColor("#000").moveDown(0.5);
    doc.fontSize(18).text("INVOICE", { align: "center" });
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
    if (params.commissionRate > 0) line("Commission Rate:", `${(params.commissionRate * 100).toFixed(0)}%`);

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

    const fy = doc.page.height - 40;
    doc.fontSize(7).fillColor("#999").text(company.footer, 50, fy, { align: "center" });

    doc.end();
  });
}

export async function generateStatementPdf(
  tenantName: string,
  unitName: string,
  entries: { month: string; rentDue: number; rentPaid: number; levyDue: number; levyPaid: number; commission: number; receiptNumber: string; notes: string }[],
): Promise<Buffer> {
  const company = await getCompany();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font("Helvetica-Bold").text(company.companyName, { align: "center" });
    doc.fontSize(9).font("Helvetica").fillColor("#666").text(company.tagline, { align: "center" });
    if (company.address) doc.fontSize(8).text(company.address, { align: "center" });
    doc.fillColor("#000").moveDown(0.3);
    doc.fontSize(15).text("TENANT STATEMENT", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Tenant: ${tenantName}`, { align: "center" });
    doc.fontSize(10).text(`Unit: ${unitName}`, { align: "center" });
    doc.moveDown(1.5);

    const cols = [50, 120, 190, 260, 330, 400, 470];
    const headers = ["Month", "Rent Due", "Rent Paid", "Levy Due", "Levy Paid", "Commission", "Receipt"];
    let y = doc.y;

    doc.font("Helvetica-Bold").fontSize(8);
    headers.forEach((h, i) => { doc.text(h, cols[i], y, { width: 65 }); });
    y = doc.y + 4;
    doc.moveTo(50, y - 2).lineTo(545, y - 2).stroke();
    doc.font("Helvetica").fontSize(8);

    let totalRentDue = 0, totalRentPaid = 0, totalLevyDue = 0, totalLevyPaid = 0, totalCommission = 0;

    for (const e of entries) {
      if (y > doc.page.height - 80) {
        const fy = doc.page.height - 40;
        doc.fontSize(7).fillColor("#999").text(company.footer, 50, fy, { align: "center" });
        doc.addPage();
        doc.font("Helvetica").fontSize(8);
        y = 40;
      }
      doc.y = y;
      doc.text(e.month, cols[0], y, { width: 65 });
      doc.text(e.rentDue.toFixed(2), cols[1], y, { width: 65 });
      doc.text(e.rentPaid.toFixed(2), cols[2], y, { width: 65 });
      doc.text(e.levyDue.toFixed(2), cols[3], y, { width: 65 });
      doc.text(e.levyPaid.toFixed(2), cols[4], y, { width: 65 });
      doc.text(e.commission.toFixed(2), cols[5], y, { width: 65 });
      doc.text(e.receiptNumber || "—", cols[6], y, { width: 65 });
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
    const bold = (x: number, v: string) => doc.text(v, x, y, { width: 65 });
    bold(cols[0], "TOTALS"); bold(cols[1], totalRentDue.toFixed(2)); bold(cols[2], totalRentPaid.toFixed(2));
    bold(cols[3], totalLevyDue.toFixed(2)); bold(cols[4], totalLevyPaid.toFixed(2)); bold(cols[5], totalCommission.toFixed(2));

    const balance = totalRentDue - totalRentPaid + totalLevyDue - totalLevyPaid;
    y = doc.y + 18;
    doc.y = y;
    doc.fontSize(11).text(`Outstanding Balance: USD ${balance.toFixed(2)}`, 50, y);

    const fy = doc.page.height - 40;
    doc.fontSize(7).fillColor("#999").text(company.footer, 50, fy, { align: "center" });
    if (company.phone || company.email) doc.text([company.phone, company.email].filter(Boolean).join("  ·  "), 50, fy + 10, { align: "center" });

    doc.end();
  });
}
