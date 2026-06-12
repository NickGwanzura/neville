"use client";

import { useState } from "react";

export function DownloadButton({ href, label = "Download PDF" }: { href: string; label?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(href);
      if (!res.ok) {
        alert("Failed to download. Please try again.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = href.split("/").pop() || "download.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className="btn btn-ghost" onClick={handleDownload} disabled={loading}
      style={{ fontSize: 13, padding: "8px 18px" }}>
      {loading ? "Downloading…" : label}
    </button>
  );
}
