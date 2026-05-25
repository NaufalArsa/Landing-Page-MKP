import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Upload, FileText, Image, Loader2,
  CheckCircle2, AlertCircle, X, Briefcase
} from "lucide-react";

interface FormState {
  title: string;
  expiredAt: string;
}

function FileDrop({
  label, accept, icon: Icon, value, onChange, hint,
}: {
  label: string;
  accept: string;
  icon: React.ElementType;
  value: File | null;
  onChange: (f: File | null) => void;
  hint?: string;
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
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging
            ? "border-[#01B1D7] bg-[#01B1D7]/5"
            : value
            ? "border-[#0A6F85] bg-[#0A6F85]/5"
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
            <Icon className="w-6 h-6 text-[#0A6F85]" />
            <span className="text-sm font-medium text-[#0A6F85] truncate max-w-xs">{value.name}</span>
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

export default function CareerForm() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const isEdit = !!params.id && params.id !== "baru";

  const [form, setForm] = useState<FormState>({ title: "", expiredAt: "" });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [existingFile, setExistingFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/careers/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setForm({
          title: d.title,
          expiredAt: d.expiredAt ? d.expiredAt.substring(0, 16) : ""
        });
        setExistingCover(d.coverImageUrl);
        setExistingFile(d.fileUrl);
      })
      .catch(() => setError("Gagal memuat data pengumuman karir"))
      .finally(() => setLoading(false));
  }, [isEdit, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !docFile) {
      setError("File dokumen/lampiran wajib diunggah");
      return;
    }
    setError("");
    setSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("expiredAt", form.expiredAt);
    if (coverFile) fd.append("cover", coverFile);
    if (docFile) fd.append("file", docFile);

    try {
      const url = isEdit ? `/api/careers/${params.id}` : "/api/careers";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan saat menyimpan");
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate("/admin/karir"), 1200);
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

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/karir")}
            className="text-gray-500 hover:text-gray-700 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Pengumuman Karir" : "Tambah Pengumuman Karir"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Perbarui informasi dan dokumen karir" : "Unggah gambar cover dan berkas pengumuman karir"}
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
          {/* Title & Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Judul Pengumuman <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="cth: Rekrutmen Anggota Teknik Sipil 2026"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tanggal Kadaluarsa (Opsional)
              </label>
              <input
                type="datetime-local"
                name="expiredAt"
                value={form.expiredAt}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
              />
              <p className="text-xs text-gray-400 mt-1">Pengumuman otomatis tidak terlihat setelah tanggal ini</p>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <FileDrop
              label="Gambar Cover (Opsional)"
              accept="image/jpeg,image/png,image/webp"
              icon={Image}
              value={coverFile}
              onChange={setCoverFile}
              hint="JPG, PNG, atau WebP — tampil sebagai cover pengumuman"
            />
            {isEdit && existingCover && !coverFile && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={existingCover}
                  alt="Cover saat ini"
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                />
                <p className="text-xs text-gray-500">Cover saat ini</p>
              </div>
            )}
            {coverFile && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={URL.createObjectURL(coverFile)}
                  alt="Preview cover"
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                />
                <p className="text-xs text-gray-500">Preview cover baru</p>
              </div>
            )}
          </div>

          {/* Document File Upload */}
          <div>
            <FileDrop
              label={`Berkas Pengumuman (File/Dokumen) ${isEdit ? "" : "*"}`}
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              icon={FileText}
              value={docFile}
              onChange={setDocFile}
              hint="PDF, DOC, DOCX, atau Gambar, maks. 20 MB"
            />
            {isEdit && existingFile && !docFile && (
              <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#0A6F85]" />
                Berkas saat ini:{" "}
                <a href={existingFile} target="_blank" rel="noopener noreferrer" className="text-[#0A6F85] hover:underline font-semibold">
                  Lihat Berkas
                </a>
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/karir")}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting || success}
              className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white px-8"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan…</>
              ) : (
                <><Upload className="w-4 h-4 mr-2" />{isEdit ? "Simpan Perubahan" : "Simpan Pengumuman"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
