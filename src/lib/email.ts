const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM_ADDRESS || "noreply@yourdomain.com";

export async function sendReceiptEmail(params: {
  to: string;
  tenantName: string;
  unitName: string;
  month: string;
  rentPaid: number;
  levyPaid: number;
  receiptNumber: string;
  commissionAmount: number;
  notes: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { to, tenantName, unitName, month, rentPaid, levyPaid, receiptNumber, commissionAmount, notes } = params;
  const totalPaid = rentPaid + levyPaid - commissionAmount;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Hilton CRM <${fromEmail}>`,
      to,
      subject: `Payment Receipt — ${unitName} — ${month}`,
      html: `
        <h2>Payment Receipt</h2>
        <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;">
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Tenant</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;">${tenantName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Unit</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;">${unitName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Month</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;">${month}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Rent Paid</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;">USD ${rentPaid.toFixed(2)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Levy Paid</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;">USD ${levyPaid.toFixed(2)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Commission</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;">USD ${commissionAmount.toFixed(2)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>Total Credited</strong></td><td style="padding:8px;border-bottom:1px solid #ddd;"><strong>USD ${totalPaid.toFixed(2)}</strong></td></tr>
          <tr><td style="padding:8px;"><strong>Receipt</strong></td><td style="padding:8px;">${receiptNumber || "N/A"}</td></tr>
          <tr><td style="padding:8px;"><strong>Notes</strong></td><td style="padding:8px;">${notes || "—"}</td></tr>
        </table>
        <p style="color:#6b7280;font-size:12px;margin-top:20px;">Hilton Properties CRM</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error:", res.status, body);
  }
}
