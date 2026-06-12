"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }
    if (data.user.mustChangePassword) {
      router.push("/change-password");
    } else {
      router.push("/");
    }
  }

  return (
    <div style={{
      display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center",
      background: "var(--light)", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "white", padding: 48, borderRadius: 16, width: 400,
        boxShadow: "0 8px 24px rgba(14,42,71,.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14, background: "var(--blue)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 28, fontWeight: 800, marginBottom: 12,
          }}>H</div>
          <h1 style={{ fontSize: 22, color: "var(--blue)", margin: 0 }}>Hilton CRM</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>Property Management</p>
        </div>
        {error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>
        )}
        <input
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          required style={{ width: "100%", padding: "12px 14px", marginBottom: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}
        />
        <input
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          required style={{ width: "100%", padding: "12px 14px", marginBottom: 20, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }}
        />
        <button type="submit" disabled={loading} style={{
          width: "100%", padding: 12, background: "var(--blue)", color: "white",
          border: 0, borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer",
        }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
