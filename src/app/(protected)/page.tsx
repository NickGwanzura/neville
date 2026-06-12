import { getCrmData } from "@/lib/data";

export default async function Dashboard() {
  const { property, month, metrics, maintenance, rentRoll, tenants, tenantMap } = await getCrmData();
  const paidInFullCount = rentRoll.filter(
    (r) => r.rentPaid >= r.rentDue && r.levyPaid >= r.levyDue,
  ).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>{property.name}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13 }}>{property.address} · Managed by {property.manager} · {month}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="badge badge-success" style={{ fontSize: 12, padding: "6px 14px" }}>
            {metrics.occupancyRate}% Occupied
          </span>
          <span className={metrics.collectionRate >= 80 ? "badge badge-success" : "badge badge-warning"} style={{ fontSize: 12, padding: "6px 14px" }}>
            {metrics.collectionRate}% Collected
          </span>
        </div>
      </div>

      <div className="cards">
        <div className="card"><span>Total Sections</span><strong>{metrics.totalUnits}</strong></div>
        <div className="card"><span>Occupied</span><strong>{metrics.occupied}</strong></div>
        <div className="card"><span>Vacant</span><strong>{metrics.vacant}</strong></div>
        <div className="card"><span>Occupancy</span><strong>{metrics.occupancyRate}%</strong></div>
        <div className="card"><span>Rent Collected</span><strong>USD {metrics.rentPaid.toFixed(2)}</strong></div>
        <div className="card"><span>Collection Rate</span><strong>{metrics.collectionRate}%</strong></div>
        <div className="card"><span>Arrears</span><strong style={{ color: metrics.arrears > 0 ? "var(--red)" : "var(--green)" }}>USD {metrics.arrears.toFixed(2)}</strong></div>
        <div className="card"><span>Net Position</span><strong>USD {metrics.netPosition.toFixed(2)}</strong></div>
      </div>

      <div className="cards" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <div className="card" style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 11 }}>Active Tenants</span>
          <strong style={{ fontSize: 22 }}>{metrics.totalTenants}</strong>
        </div>
        <div className="card" style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 11 }}>Paid in Full</span>
          <strong style={{ fontSize: 22, color: "var(--green)" }}>{paidInFullCount}/{metrics.totalTenants}</strong>
        </div>
        <div className="card" style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 11 }}>Open Maintenance</span>
          <strong style={{ fontSize: 22, color: metrics.openMaintenance > 0 ? "var(--red)" : "var(--green)" }}>{metrics.openMaintenance}</strong>
        </div>
        <div className="card" style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 11 }}>Critical</span>
          <strong style={{ fontSize: 22, color: metrics.criticalMaintenance > 0 ? "var(--red)" : "var(--green)" }}>{metrics.criticalMaintenance}</strong>
        </div>
        <div className="card" style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 11 }}>Total Expenses</span>
          <strong style={{ fontSize: 22 }}>USD {metrics.expenses.toFixed(2)}</strong>
        </div>
        <div className="card" style={{ padding: "16px 18px" }}>
          <span style={{ fontSize: 11 }}>Commission</span>
          <strong style={{ fontSize: 22 }}>USD {metrics.commission.toFixed(2)}</strong>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 8 }}>
        <section className="panel" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: 12 }}>Management Summary</h3>
          <p style={{ lineHeight: 1.6, fontSize: 13 }}>
            Leasing focus is Units 1 and 2 for the butchery offer, Unit 14, Whitehouse and the Bar prospect at USD1,300.
            Arrears focus is Luna's Shop and Alvatron Electronics reconciliation.
          </p>
        </section>

        <section className="panel" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: 12 }}>Payment Status — This Month</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {rentRoll.length === 0 && <p style={{ fontSize: 13 }}>No entries for this month.</p>}
            {rentRoll.slice(0, 6).map((r) => {
              const paid = r.rentPaid >= r.rentDue && r.levyPaid >= r.levyDue;
              const partial = r.rentPaid > 0 || r.levyPaid > 0;
              return (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #edf0f4" }}>
                  <span style={{ fontWeight: 500 }}>{tenantMap[r.tenantId] ?? ""}</span>
                  <span>
                    {paid ? (
                      <span className="badge badge-success">Paid</span>
                    ) : partial ? (
                      <span className="badge badge-warning">Partial</span>
                    ) : (
                      <span className="badge badge-danger">Outstanding</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
