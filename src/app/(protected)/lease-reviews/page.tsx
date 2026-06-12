import { getCrmData } from "@/lib/data";

function ratingInfo(rate: number) {
  if (rate >= 90) return { label: "Excellent", cls: "badge-success" };
  if (rate >= 70) return { label: "Good", cls: "badge" };
  if (rate >= 50) return { label: "Fair", cls: "badge-warning" };
  return { label: "Poor", cls: "badge-danger" };
}

function barColor(rate: number) {
  if (rate >= 70) return "green";
  if (rate >= 50) return "orange";
  return "red";
}

export default async function LeaseReviewsPage() {
  const { leaseReviews, maintenance, unitMap } = await getCrmData();

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Lease Reviews</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13 }}>
            Payment punctuality and maintenance history per tenant
          </p>
        </div>
        <a href="/api/export/reports/lease-reviews" className="btn btn-ghost" style={{ fontSize: 13, padding: "8px 18px" }}>
          ⬇ Download PDF
        </a>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Unit</th>
              <th>Months</th>
              <th>Paid</th>
              <th>Paid in Full</th>
              <th>On-Time Rate</th>
              <th>Outstanding</th>
              <th>Issues</th>
              <th>Last Payment</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {leaseReviews.map((lr) => {
              const r = ratingInfo(lr.onTimeRate);
              return (
                <tr key={lr.tenantId}>
                  <td><strong>{lr.tenantName}</strong></td>
                  <td>{lr.unitName}</td>
                  <td>{lr.totalMonths}</td>
                  <td>{lr.monthsPaid}</td>
                  <td>{lr.monthsPaidInFull}</td>
                  <td><span className={`badge ${r.cls}`} style={{ fontWeight: 700 }}>{lr.onTimeRate}%</span></td>
                  <td style={{ color: lr.outstandingBalance > 0 ? "var(--red)" : "var(--green)", fontWeight: 600, whiteSpace: "nowrap" }}>
                    USD {lr.outstandingBalance.toFixed(2)}
                  </td>
                  <td>
                    <span className={lr.maintenanceCount > 0 ? "badge badge-warning" : "badge badge-success"}>
                      {lr.maintenanceCount}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>{lr.lastPaymentMonth}</td>
                  <td><span className={`badge ${r.cls}`} style={{ fontWeight: 600 }}>{r.label}</span></td>
                </tr>
              );
            })}
            {leaseReviews.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No tenants found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="cards" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: 24 }}>
        <div className="card" style={{ padding: "16px 20px" }}>
          <span>Excellent</span>
          <strong style={{ color: "var(--green)" }}>{leaseReviews.filter((l) => l.onTimeRate >= 90).length}</strong>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <span>Good</span>
          <strong>{leaseReviews.filter((l) => l.onTimeRate >= 70 && l.onTimeRate < 90).length}</strong>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <span>Fair</span>
          <strong style={{ color: "#b45309" }}>{leaseReviews.filter((l) => l.onTimeRate >= 50 && l.onTimeRate < 70).length}</strong>
        </div>
        <div className="card" style={{ padding: "16px 20px" }}>
          <span>Poor</span>
          <strong style={{ color: "var(--red)" }}>{leaseReviews.filter((l) => l.onTimeRate < 50).length}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 4 }}>
        <section className="panel" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: 4 }}>Recent Maintenance</h3>
          <p style={{ fontSize: 12, marginBottom: 12 }}>Last 10 maintenance requests</p>
          {maintenance.length === 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>No maintenance logged.</p>}
          {maintenance.slice(0, 10).map((m) => (
            <div key={m.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: 13, padding: "9px 0", borderBottom: "1px solid #edf0f4",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{unitMap[m.unitId ?? -1] ?? "General"}</strong>
                <span style={{ color: "var(--muted)", marginLeft: 8, fontSize: 12 }}>{m.issue}</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <span className={`badge ${m.priority === "Critical" ? "badge-danger" : m.priority === "High" ? "badge-warning" : ""}`}>
                  {m.priority}
                </span>
                <span className={`badge ${m.status === "Resolved" ? "badge-success" : m.status === "In Progress" ? "badge-warning" : "badge-danger"}`}>
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="panel" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: 4 }}>Payment Punctuality</h3>
          <p style={{ fontSize: 12, marginBottom: 12 }}>On-time payment rate per tenant</p>
          {leaseReviews.length === 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>No tenants.</p>}
          {leaseReviews.map((lr) => (
            <div key={lr.tenantId} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: 13, padding: "9px 0", borderBottom: "1px solid #edf0f4",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{lr.tenantName}</strong>
                <span style={{ color: "var(--muted)", marginLeft: 8, fontSize: 12 }}>
                  {lr.monthsPaidInFull}/{lr.totalMonths} months
                </span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: lr.onTimeRate >= 70 ? "var(--green)" : "var(--red)" }}>
                  {lr.onTimeRate}%
                </span>
                <div className="bar">
                  <div className={`bar-fill ${barColor(lr.onTimeRate)}`} style={{ width: `${lr.onTimeRate}%` }} />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
