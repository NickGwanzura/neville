import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Vacancies() {
  const { units } = await getCrmData();
  const rows = units.filter((u) => u.status === "Vacant" || u.status === "Not Ready");
  return (
    <>
      <div className="page-header">
        <h2>Vacancy & Prospect Pipeline</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Unit</th><th>Status</th><th>Potential Rent</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.unitName}</strong></td>
                <td>
                  {u.status === "Not Ready" ? <span className="badge badge-warning">Not Ready</span> :
                   <span className="badge badge-danger">Vacant</span>}
                </td>
                <td>USD {money(u.monthlyRent)}</td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{u.notes}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>No vacancies</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
