"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    router.push("/");
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center",
      background: "var(--light)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "white", padding: 48, borderRadius: 16, width: 420,
        boxShadow: "0 8px 24px rgba(14,42,71,.08)",
      }}>
        <h1 style={{ fontSize: 22, color: "var(--blue)", margin: "0 0 6px", textAlign: "center" }}>Change Password</h1>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>
          You must change your password before continuing.
        </p>
        {error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}
        <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} required
          style={{ width: "100%", padding: "12px 14px", marginBottom: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
        <input type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={(e) => setNew(e.target.value)} required
          style={{ width: "100%", padding: "12px 14px", marginBottom: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
        <input type="password" placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
          style={{ width: "100%", padding: "12px 14px", marginBottom: 20, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
        <button type="submit" disabled={loading} style={{
          width: "100%", padding: 12, background: "var(--blue)", color: "white",
          border: 0, borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer",
        }}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
