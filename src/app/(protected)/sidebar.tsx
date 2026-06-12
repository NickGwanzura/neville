"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/units", label: "Units" },
  { href: "/tenants", label: "Tenants" },
  { href: "/rent-roll", label: "Rent Roll" },
  { href: "/arrears", label: "Arrears" },
  { href: "/vacancies", label: "Vacancies" },
  { href: "/expenses", label: "Expenses" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/landlord-statement", label: "Landlord Statement" },
];

const exports = [
  { href: "/export/rent-roll.csv", label: "CSV: Rent Roll" },
  { href: "/api/export/units", label: "CSV: Units" },
  { href: "/api/export/tenants", label: "CSV: Tenants" },
  { href: "/api/export/expenses", label: "CSV: Expenses" },
  { href: "/api/export/arrears", label: "CSV: Arrears" },
  { href: "/api/export/reports/landlord-statement", label: "PDF: Landlord Statement" },
  { href: "/api/export/reports/arrears", label: "PDF: Arrears Report" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="mark">H</div>
        <div>
          <h1>Hilton CRM</h1>
          <p>Property Management</p>
        </div>
      </div>
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ color: "var(--silver)", fontSize: 11, padding: "16px 12px 4px", fontWeight: 600, letterSpacing: 1 }}>EXPORTS</div>
        {exports.map((link) => (
          <a key={link.href} href={link.href} style={{ fontSize: 13 }}>
            {link.label}
          </a>
        ))}
        <div style={{ color: "var(--silver)", fontSize: 11, padding: "16px 12px 4px", fontWeight: 600, letterSpacing: 1 }}>SYSTEM</div>
        <Link href="/settings" className={pathname === "/settings" ? "active" : ""} style={{ fontSize: 13 }}>
          Company Settings
        </Link>
        <a onClick={handleLogout} style={{ fontSize: 13, cursor: "pointer" }}>
          Sign Out
        </a>
      </nav>
    </aside>
  );
}
