"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { href: "/export/rent-roll.csv", label: "Export CSV" },
];

export default function Sidebar() {
  const pathname = usePathname();
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
        {links.map((link) =>
          link.href.startsWith("/export") ? (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ),
        )}
      </nav>
    </aside>
  );
}
