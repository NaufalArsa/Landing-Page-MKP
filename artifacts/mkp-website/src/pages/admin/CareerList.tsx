import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Briefcase, Plus, Trash2, Pencil, Download,
  FileText, Loader2, AlertCircle, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CareerItem {
  id: number;
  title: string;
  coverImageUrl: string | null;
  fileUrl: string;
  expiredAt: string | null;
  createdAt: string;
}

export default function CareerList() {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/careers", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setCareers(Array.isArray(d) ? d : []))
      .catch(() => setError("Gagal memuat data karir"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengumuman karir ini?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/careers/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error ?? "Gagal menghapus pengumuman karir");
        return;
      }
      load();
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-sans">Pengumuman Karir</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola dokumen pengumuman karir PT. Mitra Karya Prima</p>
          </div>
          <Link href="/admin/karir/baru">
            <Button className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white shadow-sm transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengumuman
            </Button>
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-[#01B1D7]" />
          </div>
        ) : careers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Briefcase size={44} className="mb-3 opacity-30 text-[#0A6F85]" />
            <p className="font-medium text-gray-500">Belum ada pengumuman karir</p>
            <Link href="/admin/karir/baru">
              <Button variant="outline" className="mt-4 text-sm">
                <Plus className="w-4 h-4 mr-1" /> Tambah sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Cover Preview */}
                <div className="relative h-48 bg-gradient-to-br from-[#0A6F85] to-[#01B1D7] flex items-center justify-center overflow-hidden">
                  {c.coverImageUrl ? (
                    <img src={c.coverImageUrl} alt={c.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-white text-center p-4">
                      <Briefcase className="w-12 h-12 mb-2 opacity-60" />
                      <span className="text-sm font-bold tracking-wide uppercase opacity-80">PT MKP Karir</span>
                    </div>
                  )}
                  {c.expiredAt && (
                    <div className={`absolute top-2 left-2 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      new Date(c.expiredAt).getTime() < Date.now()
                        ? "bg-red-600/80 border border-red-500/30"
                        : "bg-green-600/80 border border-green-500/30"
                    }`}>
                      {new Date(c.expiredAt).getTime() < Date.now() ? "Kadaluarsa" : `Aktif s/d ${formatDate(c.expiredAt)}`}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(c.createdAt)}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between h-[140px]">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2" title={c.title}>
                      {c.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#0A6F85] font-semibold hover:text-[#01B1D7] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Unduh Berkas
                    </a>
                    <div className="ml-auto flex items-center gap-1">
                      <Link href={`/admin/karir/${c.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-[#0A6F85]">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                      >
                        {deletingId === c.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
