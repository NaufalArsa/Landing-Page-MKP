import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { ScrollText, Plus, Trash2, Pencil, FileText, Loader2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DirectorDecree {
  id: number;
  number: string;
  title: string;
  description: string | null;
  effectiveDate: string | null;
  pdfUrl: string;
  coverImageUrl: string | null;
}

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function DirectorDecreeList() {
  const [decrees, setDecrees] = useState<DirectorDecree[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/director-decrees", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setDecrees(Array.isArray(d) ? d : []))
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus surat keputusan ini?")) return;
    setDeletingId(id);
    await fetch(`/api/director-decrees/${id}`, { method: "DELETE", credentials: "include" });
    setDeletingId(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Surat Keputusan Direksi</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola SK Direksi PT. Mitra Karya Prima</p>
          </div>
          <Link href="/admin/surat-keputusan/baru">
            <Button className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />Tambah SK
            </Button>
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-[#01B1D7]" /></div>
        ) : decrees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <ScrollText size={44} className="mb-3 opacity-30" />
            <p className="font-medium text-gray-500">Belum ada surat keputusan</p>
            <Link href="/admin/surat-keputusan/baru">
              <Button variant="outline" className="mt-4 text-sm"><Plus className="w-4 h-4 mr-1" />Tambah sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decrees.map((d) => (
              <div key={d.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-[#1a3a5c] to-[#337AB7] flex items-center justify-center p-6">
                  {d.coverImageUrl
                    ? <img src={d.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    : <div className="flex flex-col items-center text-white text-center"><ScrollText className="w-10 h-10 mb-2 opacity-60" /><span className="font-bold text-sm line-clamp-2">{d.number}</span></div>
                  }
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-[#01B1D7] uppercase tracking-wide">{d.number}</p>
                  {d.effectiveDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Calendar className="w-3 h-3" />{formatDate(d.effectiveDate)}
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mt-1">{d.title}</h3>
                  {d.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{d.description}</p>}
                  <div className="flex items-center gap-2 pt-3 mt-2 border-t border-gray-100">
                    <a href={d.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#0A6F85]">
                      <FileText className="w-3.5 h-3.5" />Lihat PDF
                    </a>
                    <div className="ml-auto flex items-center gap-1">
                      <Link href={`/admin/surat-keputusan/${d.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-[#0A6F85]"><Pencil className="w-3.5 h-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600" onClick={() => handleDelete(d.id)} disabled={deletingId === d.id}>
                        {deletingId === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
