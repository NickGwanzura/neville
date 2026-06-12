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

export async function generateLeaseReviewPdf(
  leaseReviews: {
    tenantName: string;
    unitName: string;
    totalMonths: number;
    monthsPaid: number;
    monthsPaidInFull: number;
    onTimeRate: number;
    outstandingBalance: number;
    maintenanceCount: number;
    lastPaymentMonth: string;
  }[],
  maintenance: { id: number; unitId: number | null; issue: string; priority: string; status: string; estimatedCost: number }[],
  unitMap: Record<number, string>,
): Promise<Buffer> {
  const company = await getCompany();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).font("Helvetica-Bold").text(company.companyName, { align: "center" });
    doc.fontSize(9).font("Helvetica").fillColor("#666").text(company.tagline, { align: "center" });
    if (company.address) doc.fontSize(8).text(company.address, { align: "center" });
    doc.fillColor("#000").moveDown(0.3);
    doc.fontSize(15).text("LEASE REVIEW REPORT", { align: "center" });
    doc.moveDown(1.5);

    const cols = [40, 130, 200, 260, 330, 390, 460];
    const headers = ["Tenant", "Unit", "Months", "Paid", "Full", "Rate", "Balance"];
    let y = doc.y;

    doc.font("Helvetica-Bold").fontSize(8);
    headers.forEach((h, i) => { doc.text(h, cols[i], y, { width: 85 }); });
    y = doc.y + 4;
    doc.moveTo(40, y - 2).lineTo(545, y - 2).stroke();
    doc.font("Helvetica").fontSize(7.5);

    for (const lr of leaseReviews) {
      if (y > doc.page.height - 80) {
        doc.addPage();
        y = 40;
      }
      doc.y = y;
      doc.text(lr.tenantName, cols[0], y, { width: 85 });
      doc.text(lr.unitName, cols[1], y, { width: 65 });
      doc.text(String(lr.totalMonths), cols[2], y, { width: 55 });
      doc.text(String(lr.monthsPaid), cols[3], y, { width: 55 });
      doc.text(String(lr.monthsPaidInFull), cols[4], y, { width: 55 });
      doc.text(`${lr.onTimeRate}%`, cols[5], y, { width: 55 });
      doc.text(`USD ${lr.outstandingBalance.toFixed(2)}`, cols[6], y, { width: 75 });
      y = doc.y + 14;
    }

    y += 10;
    doc.y = y;
    doc.moveTo(40, y).lineTo(545, y).stroke();
    y += 8;
    doc.y = y;
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Lease Review Summary", 40, y);
    y += 18;
    doc.font("Helvetica").fontSize(9);

    const excellent = leaseReviews.filter((l) => l.onTimeRate >= 90).length;
    const good = leaseReviews.filter((l) => l.onTimeRate >= 70 && l.onTimeRate < 90).length;
    const fair = leaseReviews.filter((l) => l.onTimeRate >= 50 && l.onTimeRate < 70).length;
    const poor = leaseReviews.filter((l) => l.onTimeRate < 50).length;
    const totalOutstanding = leaseReviews.reduce((s, l) => s + l.outstandingBalance, 0);

    const summary = [
      ["Total Tenants", String(leaseReviews.length)],
      ["Excellent (90%+)", String(excellent)],
      ["Good (70-89%)", String(good)],
      ["Fair (50-69%)", String(fair)],
      ["Poor (<50%)", String(poor)],
      ["Total Outstanding", `USD ${totalOutstanding.toFixed(2)}`],
    ];

    const sx = 40, sv = 300;
    for (const [label, value] of summary) {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }
      doc.text(label, sx, y, { width: 250 });
      doc.text(value, sv, y, { width: 200 });
      y += 16;
    }

    y += 14;
    doc.y = y;
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Recent Maintenance Activity", 40, y);
    y += 18;
    doc.y = y;
    doc.font("Helvetica").fontSize(8);

    for (const m of maintenance.slice(0, 12)) {
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }
      const unitName = unitMap[m.unitId ?? -1] ?? "General";
      doc.text(`${unitName} — ${m.issue}`, 40, y, { width: 350 });
      doc.text(`${m.priority} · ${m.status}`, 400, y, { width: 140 });
      y += 14;
    }

    const fy = doc.page.height - 40;
    doc.fontSize(7).fillColor("#999").text(company.footer, 40, fy, { align: "center" });
    if (company.phone || company.email) doc.text([company.phone, company.email].filter(Boolean).join("  ·  "), 40, fy + 10, { align: "center" });

    doc.end();
  });
}
