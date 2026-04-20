import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { newsApi, type NewsItem } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Newspaper, FileText, Archive, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi.list().then(setNews).catch(console.error).finally(() => setLoading(false));
  }, []);

  const published = news.filter((n) => n.status === "published").length;
  const draft = news.filter((n) => n.status === "draft").length;
  const archived = news.filter((n) => n.status === "archived").length;

  const stats = [
    { label: "Total Berita", value: news.length, icon: Newspaper, color: "bg-blue-500" },
    { label: "Dipublikasikan", value: published, icon: TrendingUp, color: "bg-green-500" },
    { label: "Draft", value: draft, icon: FileText, color: "bg-yellow-500" },
    { label: "Diarsipkan", value: archived, icon: Archive, color: "bg-gray-500" },
  ];

  const recent = [...news].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusBadge: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-gray-100 text-gray-600",
  };
  const statusLabel: Record<string, string> = {
    published: "Dipublikasikan",
    draft: "Draft",
    archived: "Diarsipkan",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Selamat datang, {user?.displayName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Berikut ringkasan aktivitas konten PT. Mitra Karya Prima.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`${color} text-white p-3 rounded-lg`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Berita Terbaru</h2>
            <Link href="/admin/berita">
              <a className="text-sm text-[#01B1D7] hover:underline">Lihat semua</a>
            </Link>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Newspaper size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada berita</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recent.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      {item.category && ` · ${item.category}`}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
