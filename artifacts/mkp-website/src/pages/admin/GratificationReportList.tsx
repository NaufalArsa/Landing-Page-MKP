import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { BookMarked, Plus, Trash2, Pencil, FileText, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GratificationReport {
  id: number;
  year: number;
  title: string;
  description: string | null;
  pdfUrl: string;
  coverImageUrl: string | null;
}

export default function GratificationReportList() {
  const [reports, setReports] = useState<GratificationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/gratification-reports", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setReports(Array.isArray(d) ? d : []))
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus laporan ini?")) return;
    setDeletingId(id);
    await fetch(`/api/gratification-reports/${id}`, { method: "DELETE", credentials: "include" });
    setDeletingId(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laporan Gratifikasi</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola laporan gratifikasi PT. Mitra Karya Prima</p>
          </div>
          <Link href="/admin/laporan-gratifikasi/baru">
            <Button className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />Tambah Laporan
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
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <BookMarked size={44} className="mb-3 opacity-30" />
            <p className="font-medium text-gray-500">Belum ada laporan gratifikasi</p>
            <Link href="/admin/laporan-gratifikasi/baru">
              <Button variant="outline" className="mt-4 text-sm"><Plus className="w-4 h-4 mr-1" />Tambah sekarang</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((r) => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-[#1a5276] to-[#337AB7] flex items-center justify-center">
                  {r.coverImageUrl
                    ? <img src={r.coverImageUrl} alt="" className="w-full h-full object-cover" />
                    : <div className="flex flex-col items-center text-white"><BookMarked className="w-12 h-12 mb-2 opacity-60" /><span className="text-4xl font-extrabold">{r.year}</span></div>
                  }
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-[#01B1D7] uppercase tracking-wide">{r.year}</p>
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mt-0.5">{r.title}</h3>
                  {r.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{r.description}</p>}
                  <div className="flex items-center gap-2 pt-3 mt-2 border-t border-gray-100">
                    <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#0A6F85]">
                      <FileText className="w-3.5 h-3.5" />Lihat PDF
                    </a>
                    <div className="ml-auto flex items-center gap-1">
                      <Link href={`/admin/laporan-gratifikasi/${r.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-[#0A6F85]"><Pencil className="w-3.5 h-3.5" /></Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600" onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}>
                        {deletingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
