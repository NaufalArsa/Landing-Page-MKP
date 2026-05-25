import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { newsApi, type NewsItem } from "@/lib/api";
import { Plus, Pencil, Trash2, Newspaper, Eye } from "lucide-react";

const STATUS_TABS = [
  { key: "", label: "Semua" },
  { key: "published", label: "Dipublikasikan" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Diarsipkan" },
];

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

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  function fetchNews() {
    setLoading(true);
    newsApi.list(activeTab || undefined)
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchNews(); }, [activeTab]);

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    setDeleting(id);
    try {
      await newsApi.remove(id);
      fetchNews();
    } catch (err) {
      alert("Gagal menghapus: " + (err instanceof Error ? err.message : "Error"));
    } finally {
      setDeleting(null);
    }
  }

  const filtered = search.trim()
    ? news.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
    : news;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Berita MKP</h1>
            <p className="text-gray-500 text-sm mt-0.5">Kelola semua artikel berita</p>
          </div>
          <Link href="/admin/berita/baru">
            <a className="flex items-center gap-2 bg-[#0A6F85] hover:bg-[#01B1D7] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
              <Plus size={16} />
              Tambah Berita
            </a>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100 flex-wrap">
            {STATUS_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors -mb-px border-b-2
                  ${activeTab === key
                    ? "border-[#01B1D7] text-[#0A6F85]"
                    : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {label}
              </button>
            ))}
            <div className="ml-auto pb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berita..."
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/30"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Newspaper size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tidak ada berita ditemukan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-14 h-10 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Newspaper size={16} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      {item.category && <span> · {item.category}</span>}
                      <span className="text-gray-300 mx-1">·</span>
                      <span className="font-mono text-gray-400">{item.slug}</span>
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusBadge[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/news/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-400 hover:text-[#0A6F85] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Berita"
                    >
                      <Eye size={15} />
                    </a>
                    <Link href={`/admin/berita/${item.id}`}>
                      <a className="p-1.5 text-gray-400 hover:text-[#0A6F85] hover:bg-blue-50 rounded-lg transition-colors" title="Edit Berita">
                        <Pencil size={15} />
                      </a>
                    </Link>
                    <button
                      onClick={() => { void handleDelete(item.id); }}
                      disabled={deleting === item.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Hapus Berita"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
              Menampilkan {filtered.length} dari {news.length} berita
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
