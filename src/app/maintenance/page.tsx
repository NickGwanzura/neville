import { getCrmData } from "@/lib/data";

function money(v: number) {
  return v.toFixed(2);
}

export default async function Maintenance() {
  const { maintenance, unitMap } = await getCrmData();
  return (
    <>
      <h2>Maintenance Log</h2>
      <table>
        <thead>
          <tr><th>Unit</th><th>Issue</th><th>Priority</th><th>Status</th><th>Estimate</th><th>Notes</th></tr>
        </thead>
        <tbody>
          {maintenance.map((m) => (
            <tr key={m.id}>
              <td>{unitMap[m.unitId ?? -1] ?? "General"}</td>
              <td>{m.issue}</td>
              <td>{m.priority}</td>
              <td>{m.status}</td>
              <td>USD {money(m.estimatedCost)}</td>
              <td>{m.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
