import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Upload, FileText, Image, Loader2,
  CheckCircle2, AlertCircle, X, ShoppingBag,
} from "lucide-react";

interface FormState {
  title: string;
  description: string;
}

function FileDrop({
  label, accept, icon: Icon, value, onChange, hint, required,
}: {
  label: string;
  accept: string;
  icon: React.ElementType;
  value: File | null;
  onChange: (f: File | null) => void;
  hint?: string;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onChange(f);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging
            ? "border-[#01B1D7] bg-[#01B1D7]/5"
            : value
            ? "border-[#337AB7] bg-[#337AB7]/5"
            : "border-gray-200 bg-gray-50 hover:border-[#01B1D7]/60 hover:bg-[#01B1D7]/5"
        }`}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <Icon className="w-6 h-6 text-[#337AB7]" />
            <span className="text-sm font-medium text-[#337AB7] truncate max-w-xs">{value.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors ml-1"
            >
              <X className="w-3 h-3" />
            </button>
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

export default function PengadaanForm() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isEdit = !!params.id && params.id !== "baru";

  const [form, setForm] = useState<FormState>({ title: "", description: "" });
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
    fetch(`/api/pengadaan/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setForm({ title: d.title, description: d.description ?? "" });
        setExistingPdf(d.pdfUrl);
        setExistingCover(d.coverImageUrl ?? null);
      })
      .catch(() => setError("Gagal memuat data pengadaan"))
      .finally(() => setLoading(false));
  }, [isEdit, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !pdfFile) { setError("File PDF wajib diunggah"); return; }
    if (!isEdit && !coverFile) { setError("Gambar cover wajib diunggah"); return; }
    setError("");
    setSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (pdfFile) fd.append("pdf", pdfFile);
    if (coverFile) fd.append("cover", coverFile);

    try {
      const url = isEdit ? `/api/pengadaan/${params.id}` : "/api/pengadaan";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Terjadi kesalahan"); return; }
      setSuccess(true);
      setTimeout(() => navigate("/admin/pengadaan"), 1200);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-7 h-7 animate-spin text-[#01B1D7]" />
        </div>
      </AdminLayout>
    );
  }

  const coverPreviewSrc = coverFile
    ? URL.createObjectURL(coverFile)
    : existingCover ?? null;

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/pengadaan")}
            className="text-gray-500 hover:text-gray-700 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Pengadaan" : "Tambah Pengadaan"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Perbarui file atau info pengadaan" : "Unggah PDF dan gambar cover dokumen pengadaan"}
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Berhasil disimpan! Mengalihkan…
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Judul <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="cth: Pengadaan Jasa Pemeliharaan 2024"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi singkat</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Ringkasan singkat dokumen (opsional)…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <FileDrop
              label={isEdit ? "Ganti File PDF" : "File PDF"}
              accept="application/pdf"
              icon={FileText}
              value={pdfFile}
              onChange={setPdfFile}
              hint="PDF, maks. 20 MB"
              required={!isEdit}
            />
            {isEdit && existingPdf && !pdfFile && (
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                File saat ini:{" "}
                <a href={existingPdf} target="_blank" rel="noopener noreferrer" className="text-[#337AB7] hover:underline">
                  Lihat PDF
                </a>
              </p>
            )}
          </div>

          {/* Cover Image Upload */}
          <div>
            <FileDrop
              label={isEdit ? "Ganti Gambar Cover" : "Gambar Cover"}
              accept="image/jpeg,image/png,image/webp"
              icon={Image}
              value={coverFile}
              onChange={setCoverFile}
              hint="JPG, PNG, atau WebP — tampil sebagai cover dokumen"
              required={!isEdit}
            />
            {coverPreviewSrc && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={coverPreviewSrc}
                  alt="Preview cover"
                  className="w-16 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <p className="text-xs text-gray-500">
                  {coverFile ? "Preview cover baru" : "Cover saat ini"}
                </p>
              </div>
            )}
          </div>

          {/* Preview card */}
          {form.title && coverPreviewSrc && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Preview tampilan
              </p>
              <div className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 rounded-lg overflow-hidden shadow-md"
                  style={{ width: 80, height: 110 }}
                >
                  <img
                    src={coverPreviewSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{form.title}</p>
                  {form.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{form.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/pengadaan")}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting || success}
              className="bg-[#337AB7] hover:bg-[#337AB7]/90 text-white px-8"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan…</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />{isEdit ? "Simpan Perubahan" : "Simpan Pengadaan"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
