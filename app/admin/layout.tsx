import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin | PitPet Store",
};

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/pets", label: "Pets", icon: "🐶" },
  { href: "/admin/tutors", label: "Tutores", icon: "👤" },
  { href: "/admin/alerts", label: "Alertas Sanitários", icon: "🚨" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex-shrink-0 hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <div>
              <p className="font-bold text-[#2c1810] text-sm leading-tight">PitPet Store</p>
              <p className="text-xs text-[#8a6050]">Painel Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5c3d30] hover:bg-[#fff5f4] hover:text-[#f07070] transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-100">
          <Link
            href="/"
            className="text-xs text-[#8a6050] hover:text-[#f07070] transition-colors"
          >
            ← Voltar ao site
          </Link>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#5c3d30] hover:bg-[#fff5f4] whitespace-nowrap flex-shrink-0"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
