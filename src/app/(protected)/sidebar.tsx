"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard", icon: "◻" },
  { href: "/units", label: "Units", icon: "⊞" },
  { href: "/tenants", label: "Tenants", icon: "👥" },
  { href: "/rent-roll", label: "Rent Roll", icon: "📋" },
  { href: "/arrears", label: "Arrears", icon: "⚠" },
  { href: "/vacancies", label: "Vacancies", icon: "▢" },
  { href: "/expenses", label: "Expenses", icon: "📊" },
  { href: "/maintenance", label: "Maintenance", icon: "🔧" },
  { href: "/landlord-statement", label: "Statement", icon: "📄" },
];

const exports = [
  { href: "/export/rent-roll.csv", label: "CSV: Rent Roll" },
  { href: "/api/export/units", label: "CSV: Units" },
  { href: "/api/export/tenants", label: "CSV: Tenants" },
  { href: "/api/export/expenses", label: "CSV: Expenses" },
  { href: "/api/export/arrears", label: "CSV: Arrears" },
  { href: "/api/export/reports/landlord-statement", label: "PDF: Statement" },
  { href: "/api/export/reports/arrears", label: "PDF: Arrears" },
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
        <div className="nav-section">Main</div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <div className="nav-section">Exports</div>
        {exports.map((link) => (
          <a key={link.href} href={link.href} className="nav-item">
            <span className="nav-icon">↓</span>
            {link.label}
          </a>
        ))}
        <div className="nav-section">System</div>
        <Link href="/settings" className={pathname === "/settings" ? "active nav-item" : "nav-item"}>
          <span className="nav-icon">⚙</span>
          Company Settings
        </Link>
        <a onClick={handleLogout} className="nav-item" style={{ cursor: "pointer" }}>
          <span className="nav-icon">↩</span>
          Sign Out
        </a>
      </nav>
    </aside>
  );
}
