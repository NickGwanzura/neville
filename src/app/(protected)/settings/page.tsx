"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  currency: string;
  footer: string;
  primaryColor: string;
  secondaryColor: string;
};

const defaults: Settings = {
  companyName: "Hilton Properties",
  tagline: "Premier Property Management Platform",
  address: "",
  phone: "",
  email: "",
  website: "",
  logoUrl: "",
  currency: "USD",
  footer: "Thank you for your business",
  primaryColor: "#0e2a47",
  secondaryColor: "#173d63",
};

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.companyName) setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update(field: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <p style={{ padding: 32, color: "var(--muted)" }}>Loading...</p>;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Company Settings</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13 }}>Customise branding that appears on PDFs and reports</p>
        </div>
        <button onClick={() => router.push("/")} style={{
          background: "transparent", border: "1px solid #d1d5db", padding: "8px 16px",
          borderRadius: 8, cursor: "pointer", fontSize: 13,
        }}>Back to Dashboard</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="panel" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Branding</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Company Name" value={settings.companyName} onChange={(v) => update("companyName", v)} />
            <Input label="Tagline" value={settings.tagline} onChange={(v) => update("tagline", v)} />
            <Input label="Logo URL (optional)" value={settings.logoUrl} onChange={(v) => update("logoUrl", v)} />
            <Input label="Currency" value={settings.currency} onChange={(v) => update("currency", v)} />
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Primary Color</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)}
                  style={{ width: 44, height: 44, border: 0, cursor: "pointer" }} />
                <input value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)}
                  style={{ flex: 1, padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>Secondary Color</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={settings.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)}
                  style={{ width: 44, height: 44, border: 0, cursor: "pointer" }} />
                <input value={settings.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)}
                  style={{ flex: 1, padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Contact Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Address" value={settings.address} onChange={(v) => update("address", v)} />
            <Input label="Phone" value={settings.phone} onChange={(v) => update("phone", v)} />
            <Input label="Email" value={settings.email} onChange={(v) => update("email", v)} />
            <Input label="Website" value={settings.website} onChange={(v) => update("website", v)} />
          </div>
        </div>

        <div className="panel" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Footer</h3>
          <textarea value={settings.footer} onChange={(e) => update("footer", e.target.value)}
            style={{ width: "100%", padding: 10, border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, minHeight: 60, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button type="submit" disabled={saving} style={{
            background: "var(--blue)", color: "white", border: 0, padding: "10px 28px",
            borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && <span style={{ color: "#059669", fontSize: 13, fontWeight: 600 }}>Saved!</span>}
        </div>
      </form>

      <style>{`
        input:focus, textarea:focus { outline: 2px solid var(--blue); outline-offset: -1px; }
      `}</style>
    </>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }} />
    </div>
  );
}
