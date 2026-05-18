import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { newsApi, type NewsItem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Newspaper, FileText, Archive, TrendingUp,
  BookOpen, BookMarked, ScrollText, ShoppingBag, Plus,
  ArrowRight, Clock, ChevronRight,
} from "lucide-react";
import { Link } from "wouter";

interface CountItem { count: number }

interface AnnualReport { id: number; year: number; title: string; createdAt: string }
interface GratificationReport { id: number; year: number; title: string; createdAt: string }
interface DirectorDecree { id: number; number: string; title: string; createdAt: string }
interface PengadaanItem { id: number; title: string; createdAt: string }

function StatCard({
  label, value, icon: Icon, color, loading, href,
}: {
  label: string; value: number; icon: React.ElementType;
  color: string; loading: boolean; href: string;
}) {
  return (
    <Link href={href}>
      <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group ${loading ? "animate-pulse" : ""}`}>
        <div className={`${color} text-white p-3 rounded-xl flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl font-bold text-gray-800">{loading ? "—" : value}</div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">{label}</div>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

function QuickAction({ href, icon: Icon, label, description, color }: {
  href: string; icon: React.ElementType; label: string; description: string; color: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
        <div className={`${color} text-white p-2.5 rounded-lg flex-shrink-0`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
          <p className="text-xs text-gray-400 truncate">{description}</p>
        </div>
        <Plus size={15} className="text-gray-300 group-hover:text-[#01B1D7] transition-colors flex-shrink-0" />
      </div>
    </Link>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const statusBadge: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-600",
};
const statusLabel: Record<string, string> = {
  published: "Publik",
  draft: "Draft",
  archived: "Arsip",
};

export default function Dashboard() {
  const { user } = useAuth();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [annualReports, setAnnualReports] = useState<AnnualReport[]>([]);
  const [gratReports, setGratReports] = useState<GratificationReport[]>([]);
  const [decrees, setDecrees] = useState<DirectorDecree[]>([]);
  const [pengadaan, setPengadaan] = useState<PengadaanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      newsApi.list().catch(() => [] as NewsItem[]),
      fetch("/api/annual-reports", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/gratification-reports", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/director-decrees", { credentials: "include" }).then((r) => r.json()).catch(() => []),
      fetch("/api/pengadaan", { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]).then(([n, ar, gr, dd, pg]) => {
      setNews(Array.isArray(n) ? n : []);
      setAnnualReports(Array.isArray(ar) ? ar : []);
      setGratReports(Array.isArray(gr) ? gr : []);
      setDecrees(Array.isArray(dd) ? dd : []);
      setPengadaan(Array.isArray(pg) ? pg : []);
    }).finally(() => setLoading(false));
  }, []);

  const published = news.filter((n) => n.status === "published").length;
  const draft = news.filter((n) => n.status === "draft").length;
  const archived = news.filter((n) => n.status === "archived").length;

  const topStats = [
    { label: "Total Berita", value: news.length, icon: Newspaper, color: "bg-[#337AB7]", href: "/admin/berita" },
    { label: "Laporan Tahunan", value: annualReports.length, icon: BookOpen, color: "bg-[#0A6F85]", href: "/admin/laporan-tahunan" },
    { label: "Laporan Gratifikasi", value: gratReports.length, icon: BookMarked, color: "bg-[#1a5276]", href: "/admin/laporan-gratifikasi" },
    { label: "Surat Keputusan", value: decrees.length, icon: ScrollText, color: "bg-[#6c3483]", href: "/admin/surat-keputusan" },
    { label: "Pengadaan", value: pengadaan.length, icon: ShoppingBag, color: "bg-[#b7570a]", href: "/admin/pengadaan" },
  ];

  const newsStats = [
    { label: "Dipublikasikan", value: published, icon: TrendingUp, color: "bg-green-500", href: "/admin/berita" },
    { label: "Draft", value: draft, icon: FileText, color: "bg-yellow-500", href: "/admin/berita" },
    { label: "Diarsipkan", value: archived, icon: Archive, color: "bg-gray-400", href: "/admin/berita" },
  ];

  const quickActions = [
    { href: "/admin/berita/baru", icon: Newspaper, label: "Tambah Berita", description: "Buat artikel berita baru", color: "bg-[#337AB7]" },
    { href: "/admin/laporan-tahunan/baru", icon: BookOpen, label: "Unggah Laporan Tahunan", description: "Upload PDF laporan tahunan", color: "bg-[#0A6F85]" },
    { href: "/admin/laporan-gratifikasi/baru", icon: BookMarked, label: "Unggah Laporan Gratifikasi", description: "Upload PDF laporan gratifikasi", color: "bg-[#1a5276]" },
    { href: "/admin/surat-keputusan/baru", icon: ScrollText, label: "Tambah Surat Keputusan", description: "Upload SK Direksi baru", color: "bg-[#6c3483]" },
    { href: "/admin/pengadaan/baru", icon: ShoppingBag, label: "Tambah Pengadaan", description: "Upload dokumen pengadaan baru", color: "bg-[#b7570a]" },
  ];

  // Combined recent activity
  type ActivityItem = { id: number; title: string; type: string; typeColor: string; date: string; badge?: string; badgeColor?: string };
  const activity: ActivityItem[] = [
    ...news.slice(0, 5).map((n) => ({
      id: n.id,
      title: n.title,
      type: "Berita",
      typeColor: "text-[#337AB7] bg-[#337AB7]/10",
      date: n.createdAt,
      badge: statusLabel[n.status],
      badgeColor: statusBadge[n.status],
    })),
    ...annualReports.slice(0, 3).map((r) => ({
      id: r.id,
      title: `${r.year} — ${r.title}`,
      type: "Lap. Tahunan",
      typeColor: "text-[#0A6F85] bg-[#0A6F85]/10",
      date: r.createdAt,
    })),
    ...gratReports.slice(0, 3).map((r) => ({
      id: r.id,
      title: `${r.year} — ${r.title}`,
      type: "Gratifikasi",
      typeColor: "text-[#1a5276] bg-[#1a5276]/10",
      date: r.createdAt,
    })),
    ...decrees.slice(0, 3).map((d) => ({
      id: d.id,
      title: `${d.number} — ${d.title}`,
      type: "SK Direksi",
      typeColor: "text-[#6c3483] bg-[#6c3483]/10",
      date: d.createdAt,
    })),
    ...pengadaan.slice(0, 3).map((p) => ({
      id: p.id,
      title: p.title,
      type: "Pengadaan",
      typeColor: "text-[#b7570a] bg-[#b7570a]/10",
      date: p.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";

  return (
    <AdminLayout>
      <div className="space-y-7">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {greeting}, {user?.displayName?.split(" ")[0]}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Ringkasan konten PT. Mitra Karya Prima hari ini
            </p>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-1.5">
            <Clock size={14} />
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>

        {/* Top stats — one per content type */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Total Konten</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {topStats.map((s) => (
              <StatCard key={s.label} {...s} loading={loading} />
            ))}
          </div>
        </div>

        {/* News breakdown */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Status Berita</h2>
          <div className="grid grid-cols-3 gap-4">
            {newsStats.map((s) => (
              <StatCard key={s.label} {...s} loading={loading} />
            ))}
          </div>
        </div>

        {/* Two columns: Quick actions + Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Plus size={15} className="text-[#01B1D7]" />
              Aksi Cepat
            </h2>
            <div className="space-y-3">
              {quickActions.map((a) => (
                <QuickAction key={a.href} {...a} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Clock size={15} className="text-[#01B1D7]" />
                Aktivitas Terbaru
              </h2>
            </div>

            {loading ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <Newspaper size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Belum ada konten</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {activity.map((item, i) => (
                  <div key={`${item.type}-${item.id}-${i}`} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.typeColor}`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Manage all sections */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">Kelola Konten</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              { href: "/admin/berita", icon: Newspaper, label: "Berita MKP", desc: `${news.length} artikel`, color: "text-[#337AB7]" },
              { href: "/admin/laporan-tahunan", icon: BookOpen, label: "Laporan Tahunan", desc: `${annualReports.length} laporan`, color: "text-[#0A6F85]" },
              { href: "/admin/laporan-gratifikasi", icon: BookMarked, label: "Laporan Gratifikasi", desc: `${gratReports.length} laporan`, color: "text-[#1a5276]" },
              { href: "/admin/surat-keputusan", icon: ScrollText, label: "Surat Keputusan", desc: `${decrees.length} dokumen`, color: "text-[#6c3483]" },
              { href: "/admin/pengadaan", icon: ShoppingBag, label: "Pengadaan", desc: `${pengadaan.length} dokumen`, color: "text-[#b7570a]" },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link key={href} href={href}>
                <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={color} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
                      <p className="text-xs text-gray-400">{loading ? "…" : desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
