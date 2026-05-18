import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Image, Loader2, CheckCircle2, AlertCircle, X, BookMarked } from "lucide-react";

function FileDrop({ label, accept, icon: Icon, value, onChange, hint }: {
  label: string; accept: string; icon: React.ElementType;
  value: File | null; onChange: (f: File | null) => void; hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onChange(f); };
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragging ? "border-[#01B1D7] bg-[#01B1D7]/5" : value ? "border-[#0A6F85] bg-[#0A6F85]/5" : "border-gray-200 bg-gray-50 hover:border-[#01B1D7]/60 hover:bg-[#01B1D7]/5"}`}
      >
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <Icon className="w-6 h-6 text-[#0A6F85]" />
            <span className="text-sm font-medium text-[#0A6F85] truncate max-w-xs">{value.name}</span>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(null); }} className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors ml-1"><X className="w-3 h-3" /></button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Icon className="w-8 h-8" />
            <p className="text-sm font-medium">Klik atau seret file ke sini</p>
            {hint && <p className="text-xs">{hint}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GratificationReportForm() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isEdit = !!params.id && params.id !== "baru";

  const [form, setForm] = useState({ year: String(new Date().getFullYear()), title: "", description: "" });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingPdf, setExistingPdf] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/gratification-reports/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { setForm({ year: String(d.year), title: d.title, description: d.description ?? "" }); setExistingPdf(d.pdfUrl); setExistingCover(d.coverImageUrl ?? null); })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [isEdit, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !pdfFile) { setError("File PDF wajib diunggah"); return; }
    setError(""); setSubmitting(true);
    const fd = new FormData();
    fd.append("year", form.year); fd.append("title", form.title); fd.append("description", form.description);
    if (pdfFile) fd.append("pdf", pdfFile);
    if (coverFile) fd.append("cover", coverFile);
    try {
      const res = await fetch(isEdit ? `/api/gratification-reports/${params.id}` : "/api/gratification-reports", { method: isEdit ? "PUT" : "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Terjadi kesalahan"); return; }
      setSuccess(true);
      setTimeout(() => navigate("/admin/laporan-gratifikasi"), 1200);
    } catch { setError("Gagal menghubungi server"); } finally { setSubmitting(false); }
  };

  if (loading) return <AdminLayout><div className="flex justify-center py-24"><Loader2 className="w-7 h-7 animate-spin text-[#01B1D7]" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/laporan-gratifikasi")} className="text-gray-500 hover:text-gray-700 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" />Kembali
          </Button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit" : "Tambah"} Laporan Gratifikasi</h1>
          <p className="text-sm text-gray-500 mt-1">{isEdit ? "Perbarui file atau info laporan" : "Unggah PDF dan gambar cover laporan"}</p>
        </div>
        {success && <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm"><CheckCircle2 className="w-4 h-4" />Berhasil disimpan! Mengalihkan…</div>}
        {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertCircle className="w-4 h-4" />{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun <span className="text-red-500">*</span></label>
              <input type="number" name="year" value={form.year} onChange={handleChange} required min={1900} max={2100}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="cth: Laporan Gratifikasi 2024"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi singkat</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Ringkasan singkat (opsional)…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]" />
          </div>
          <FileDrop label={`File PDF${isEdit ? "" : " *"}`} accept="application/pdf" icon={FileText} value={pdfFile} onChange={setPdfFile} hint="PDF, maks. 20 MB" />
          {isEdit && existingPdf && !pdfFile && (
            <p className="text-xs text-gray-500 -mt-4 flex items-center gap-1"><FileText className="w-3 h-3" />File saat ini: <a href={existingPdf} target="_blank" rel="noopener noreferrer" className="text-[#0A6F85] hover:underline">Lihat PDF</a></p>
          )}
          <div>
            <FileDrop label="Gambar Cover (opsional)" accept="image/jpeg,image/png,image/webp" icon={Image} value={coverFile} onChange={setCoverFile} hint="JPG, PNG, atau WebP — tampil sebagai cover buku" />
            {isEdit && existingCover && !coverFile && (
              <div className="mt-2 flex items-center gap-3"><img src={existingCover} alt="" className="w-12 h-16 object-cover rounded border border-gray-200" /><p className="text-xs text-gray-500">Cover saat ini</p></div>
            )}
            {coverFile && (
              <div className="mt-2 flex items-center gap-3"><img src={URL.createObjectURL(coverFile)} alt="" className="w-12 h-16 object-cover rounded border border-gray-200" /><p className="text-xs text-gray-500">Preview cover baru</p></div>
            )}
          </div>
          {(form.title || form.year) && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Preview tampilan cover</p>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-[#1a5276] to-[#337AB7] flex flex-col items-center justify-between p-4" style={{ width: 80, height: 110 }}>
                  {coverFile ? <img src={URL.createObjectURL(coverFile)} alt="" className="w-full h-full object-cover" /> : <><BookMarked className="w-5 h-5 text-white/60" /><span className="text-white font-extrabold text-xl leading-none">{form.year}</span><div className="w-full h-0.5 bg-white/30 rounded-full" /></>}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#01B1D7] uppercase tracking-wide">{form.year}</p>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{form.title || "Judul laporan"}</p>
                  {form.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{form.description}</p>}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/laporan-gratifikasi")}>Batal</Button>
            <Button type="submit" disabled={submitting || success} className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white px-8">
              {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan…</> : <><Upload className="w-4 h-4 mr-2" />{isEdit ? "Simpan Perubahan" : "Simpan Laporan"}</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
