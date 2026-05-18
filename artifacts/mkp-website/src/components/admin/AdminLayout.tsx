import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  BookMarked,
  ScrollText,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/berita", label: "Berita MKP", icon: Newspaper },
  { href: "/admin/laporan-tahunan", label: "Laporan Tahunan", icon: BookOpen },
  { href: "/admin/laporan-gratifikasi", label: "Laporan Gratifikasi", icon: BookMarked },
  { href: "/admin/surat-keputusan", label: "Surat Keputusan", icon: ScrollText },
  { href: "/admin/pengadaan", label: "Pengadaan", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleLabel: Record<string, string> = {
    admin: "Administrator",
    humas: "Tim Humas",
    sdm: "Tim SDM",
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0A6F85] text-white z-30 flex flex-col
          transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/20">
          <img
            src="https://mitrakaryaprima.com/wp-content/uploads/2019/04/cropped-logo-mkp.png"
            alt="MKP"
            className="h-8 object-contain brightness-0 invert"
          />
          <div>
            <div className="text-sm font-bold leading-tight">PT. Mitra Karya Prima</div>
            <div className="text-xs text-white/60">Admin Panel</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href !== "/admin" && location.startsWith(href));
            return (
              <Link key={href} href={href}>
                <a
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${active ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  {label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/20">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {user?.displayName?.[0] ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user?.displayName}</div>
              <div className="text-xs text-white/60">{roleLabel[user?.role ?? ""] ?? user?.role}</div>
            </div>
          </div>
          <button
            onClick={() => { void logout(); }}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-14 bg-white border-b border-gray-200 flex items-center gap-4 px-4 lg:px-6">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <span>Admin</span>
            {location !== "/admin" && (
              <>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-medium capitalize">
                  {location.replace("/admin/", "").replace("-", " ")}
                </span>
              </>
            )}
          </nav>

          <div className="ml-auto text-sm text-gray-500 hidden sm:block">
            {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
