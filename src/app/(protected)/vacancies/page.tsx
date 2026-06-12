import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Vacancies() {
  const { units } = await getCrmData();
  const rows = units.filter((u) => u.status === "Vacant" || u.status === "Not Ready");
  return (
    <>
      <h2>Vacancy & Prospect Pipeline</h2>
      <table>
        <thead>
          <tr><th>Unit</th><th>Status</th><th>Potential Rent</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id}>
              <td>{u.unitName}</td>
              <td>{u.status}</td>
              <td>USD {money(u.monthlyRent)}</td>
              <td>{u.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
