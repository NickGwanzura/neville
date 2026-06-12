"use client";

export function DeleteButton({ action, label = "Delete" }: { action: string; label?: string }) {
  return (
    <form method="post" action={action} onSubmit={(e) => {
      if (!confirm("Delete this record?")) e.preventDefault();
    }}>
      <button type="submit" className="link-btn">{label}</button>
    </form>
  );
}
