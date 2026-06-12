"use client";

export function DeleteButton({ action, label = "Delete" }: { action: string; label?: string }) {
  return (
    <form method="post" action={action} onSubmit={(e) => {
      if (!confirm("Delete this record?")) e.preventDefault();
    }}>
      <button
        style={{
          color: "var(--red, #c00)",
          fontSize: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        {label}
      </button>
    </form>
  );
}
