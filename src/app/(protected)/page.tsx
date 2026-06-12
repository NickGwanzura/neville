import { getCrmData } from "@/lib/data";

export default async function Dashboard() {
  const { property, month, metrics } = await getCrmData();
  return (
    <>
      <div className="page-header">
        <div>
          <h2>{property.name}</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13 }}>{property.address} · Managed by {property.manager} · {month}</p>
        </div>
        <span className="badge badge-success" style={{ fontSize: 13, padding: "6px 14px" }}>
          {metrics.occupancyRate}% Occupied
        </span>
      </div>

      <div className="cards">
        <div className="card"><span>Total Sections</span><strong>{metrics.totalUnits}</strong></div>
        <div className="card"><span>Occupied</span><strong>{metrics.occupied}</strong></div>
        <div className="card"><span>Vacant</span><strong>{metrics.vacant}</strong></div>
        <div className="card"><span>Occupancy</span><strong>{metrics.occupancyRate}%</strong></div>
        <div className="card"><span>Rent Collected</span><strong>USD {metrics.rentPaid.toFixed(2)}</strong></div>
        <div className="card"><span>Levies Collected</span><strong>USD {metrics.levyPaid.toFixed(2)}</strong></div>
        <div className="card"><span>Commission</span><strong>USD {metrics.commission.toFixed(2)}</strong></div>
        <div className="card"><span>Net Position</span><strong>USD {metrics.netPosition.toFixed(2)}</strong></div>
      </div>

      <section className="panel">
        <h3>Management Summary</h3>
        <p style={{ lineHeight: 1.6, fontSize: 13 }}>
          Leasing focus is Units 1 and 2 for the butchery offer, Unit 14, Whitehouse and the Bar prospect at USD1,300.
          Arrears focus is Luna's Shop and Alvatron Electronics reconciliation.
        </p>
      </section>
    </>
  );
}
