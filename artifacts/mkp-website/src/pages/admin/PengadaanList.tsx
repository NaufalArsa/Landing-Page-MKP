import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  ShoppingBag, Plus, Trash2, Pencil,
  FileText, Loader2, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PengadaanItem {
  id: number;
  title: string;
  description: string | null;
  pdfUrl: string;
  coverImageUrl: string;
  createdAt: string;
}

export default function PengadaanList() {
  const [items, setItems] = useState<PengadaanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/pengadaan", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus dokumen pengadaan ini?")) return;
    setDeletingId(id);
    await fetch(`/api/pengadaan/${id}`, { method: "DELETE", credentials: "include" });
    setDeletingId(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pengadaan</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola dokumen pengadaan PT. Mitra Karya Prima</p>
          </div>
          <Link href="/admin/pengadaan/baru">
            <Button className="bg-[#337AB7] hover:bg-[#337AB7]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengadaan
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
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <ShoppingBag size={44} className="mb-3 opacity-30" />
            <p className="font-medium text-gray-500">Belum ada dokumen pengadaan</p>
            <Link href="/admin/pengadaan/baru">
              <Button variant="outline" className="mt-4 text-sm">
                <Plus className="w-4 h-4 mr-1" /> Tambah sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={item.coverImageUrl} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#337AB7] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Lihat PDF
                    </a>
                    <div className="ml-auto flex items-center gap-1">
                      <Link href={`/admin/pengadaan/${item.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-[#337AB7]">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />
                        }
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
