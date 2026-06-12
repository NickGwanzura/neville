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
    logoUrl: "",
    currency: "USD",
    footer: "Thank you for your business",
    primaryColor: "#0e2a47",
    secondaryColor: "#173d63",
  };
}

function addHeader(doc: typeof PDFDocument.prototype, company: Awaited<ReturnType<typeof getCompany>>, title: string) {
  doc.fontSize(18).font("Helvetica-Bold").text(company.companyName, { align: "center" });
  doc.fontSize(9).font("Helvetica").fillColor("#666").text(company.tagline, { align: "center" });
  doc.fillColor("#000");
  doc.fontSize(14).text(title, { align: "center" });
  doc.moveDown(1.5);
}

function addFooter(doc: typeof PDFDocument.prototype, company: Awaited<ReturnType<typeof getCompany>>) {
  const y = doc.page.height - 40;
  doc.fontSize(7).fillColor("#999").font("Helvetica");
  doc.text(company.footer, 40, y, { align: "center" });
  const line = [];
  if (company.address) line.push(company.address);
  if (company.phone) line.push(company.phone);
  if (company.email) line.push(company.email);
  if (line.length) doc.text(line.join("  ·  "), 40, y + 10, { align: "center" });
}

export async function generatePdf(
  title: string,
  rows: [string, string][],
): Promise<Buffer> {
  const company = await getCompany();
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    addHeader(doc, company, title);

    const tableTop = doc.y;
    const col1 = 40;
    const col2 = 300;

    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Item", col1, tableTop);
    doc.text("Value", col2, tableTop);
    doc.moveTo(col1, tableTop + 15).lineTo(545, tableTop + 15).stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(9);
    let y = doc.y;
    for (const [label, value] of rows) {
      if (y > doc.page.height - 80) {
        addFooter(doc, company);
        doc.addPage();
        addHeader(doc, company, title);
        y = doc.y;
      }
      doc.text(label, col1, y, { width: 250 });
      doc.text(value, col2, y, { width: 250 });
      y += 18;
    }

    doc.moveTo(col1, y).lineTo(545, y).stroke();
    addFooter(doc, company);
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
