import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Units() {
  const { units } = await getCrmData();
  return (
    <>
      <h2>Units Register</h2>
      <table>
        <thead>
          <tr><th>Unit</th><th>Use</th><th>Status</th><th>Rent</th><th>Levy</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.id}>
              <td>{u.unitName}</td>
              <td>{u.useType}</td>
              <td><span>{u.status}</span></td>
              <td>USD {money(u.monthlyRent)}</td>
              <td>USD {money(u.monthlyLevy)}</td>
              <td>{u.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
