import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Upload, Image, Loader2, CheckCircle2, AlertCircle, X, Network, ZoomIn,
} from "lucide-react";

export default function OrgStructureAdmin() {
  const [existing, setExisting] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/org-structure", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setExisting(d?.imageUrl ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("Pilih gambar terlebih dahulu"); return; }
    setError("");
    setSubmitting(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch("/api/org-structure", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Terjadi kesalahan"); return; }
      setExisting(data.imageUrl);
      setFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  };

  const previewSrc = file ? URL.createObjectURL(file) : existing;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Unggah bagan struktur organisasi PT. Mitra Karya Prima. Gambar baru akan menggantikan yang lama.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Gambar berhasil diperbarui!
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Drop zone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gambar Bagan <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => ref.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-[#01B1D7] bg-[#01B1D7]/5"
                  : file
                  ? "border-[#0A6F85] bg-[#0A6F85]/5"
                  : "border-gray-200 bg-gray-50 hover:border-[#01B1D7]/60 hover:bg-[#01B1D7]/5"
              }`}
            >
              <input
                ref={ref}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <Image className="w-6 h-6 text-[#0A6F85]" />
                  <span className="text-sm font-medium text-[#0A6F85] truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Network className="w-10 h-10 mb-1" />
                  <p className="text-sm font-medium">Klik atau seret gambar ke sini</p>
                  <p className="text-xs">JPG, PNG, atau WebP — maks. 20 MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting || !file}
              className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white px-8"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan…</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />Simpan Gambar</>
              )}
            </Button>
          </div>
        </form>

        {/* Current image preview */}
        {!loading && previewSrc && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">
              {file ? "Preview gambar baru" : "Gambar saat ini"}
            </p>
            <div
              className="relative rounded-xl overflow-hidden cursor-zoom-in border border-gray-100 bg-gray-50"
              onClick={() => setZoomed(true)}
            >
              <img src={previewSrc} alt="Struktur Organisasi" className="w-full h-auto max-h-[500px] object-contain" />
              <div className="absolute bottom-3 right-3 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 text-xs text-gray-600 shadow">
                <ZoomIn className="w-3 h-3" />
                Perbesar
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#01B1D7]" />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {zoomed && previewSrc && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <img src={previewSrc} alt="Struktur Organisasi" className="max-w-full max-h-full object-contain rounded-xl" />
        </div>
      )}
    </AdminLayout>
  );
}
