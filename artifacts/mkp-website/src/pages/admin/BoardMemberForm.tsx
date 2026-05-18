import { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useSearch } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Upload, Image, Loader2,
  CheckCircle2, AlertCircle, X, User,
} from "lucide-react";

export default function BoardMemberForm() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const search = useSearch();
  const typeFromQuery = new URLSearchParams(search).get("type") ?? "direksi";
  const isEdit = !!params.id && params.id !== "baru";

  const [form, setForm] = useState({
    name: "",
    position: "",
    type: typeFromQuery as "direksi" | "komisaris",
    orderIndex: "0",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/board-members/${params.id}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setForm({
          name: d.name,
          position: d.position ?? "",
          type: d.type,
          orderIndex: String(d.orderIndex ?? 0),
        });
        setExistingPhoto(d.photoUrl);
      })
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [isEdit, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setPhotoFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !photoFile) { setError("Foto wajib diunggah"); return; }
    setError("");
    setSubmitting(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("position", form.position);
    fd.append("type", form.type);
    fd.append("orderIndex", form.orderIndex);
    if (photoFile) fd.append("photo", photoFile);

    try {
      const url = isEdit ? `/api/board-members/${params.id}` : "/api/board-members";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd, credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Terjadi kesalahan"); return; }
      setSuccess(true);
      setTimeout(() => navigate("/admin/board-members"), 1200);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setSubmitting(false);
    }
  };

  const previewSrc = photoFile
    ? URL.createObjectURL(photoFile)
    : existingPhoto ?? null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-24"><Loader2 className="w-7 h-7 animate-spin text-[#01B1D7]" /></div>
      </AdminLayout>
    );
  }

  const typeLabel = form.type === "direksi" ? "Dewan Direksi" : "Dewan Komisaris";

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/board-members")}
            className="text-gray-500 hover:text-gray-700 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Anggota" : `Tambah Anggota ${typeLabel}`}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? "Perbarui nama, jabatan, atau foto anggota" : "Unggah foto dan isi nama anggota"}
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
            <CheckCircle2 className="w-4 h-4" />Berhasil disimpan! Mengalihkan…
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Type selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dewan <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7] bg-white"
            >
              <option value="direksi">Dewan Direksi</option>
              <option value="komisaris">Dewan Komisaris</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="cth: Dr. Ir. Ahmad Fauzi, M.M."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Jabatan (opsional)</label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="cth: Direktur Utama"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan (0 = pertama)</label>
            <input
              type="number"
              name="orderIndex"
              value={form.orderIndex}
              onChange={handleChange}
              min={0}
              max={10}
              className="w-28 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 focus:border-[#01B1D7]"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isEdit ? "Ganti Foto" : "Foto"} {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <div
              onClick={() => ref.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-[#01B1D7] bg-[#01B1D7]/5"
                  : photoFile
                  ? "border-[#0A6F85] bg-[#0A6F85]/5"
                  : "border-gray-200 bg-gray-50 hover:border-[#01B1D7]/60 hover:bg-[#01B1D7]/5"
              }`}
            >
              <input
                ref={ref}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />
              {photoFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Image className="w-5 h-5 text-[#0A6F85]" />
                  <span className="text-sm font-medium text-[#0A6F85] truncate max-w-xs">{photoFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPhotoFile(null); }}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <User className="w-8 h-8" />
                  <p className="text-sm font-medium">Klik atau seret foto ke sini</p>
                  <p className="text-xs">JPG, PNG, atau WebP — maks. 10 MB</p>
                </div>
              )}
            </div>

            {/* Photo preview */}
            {previewSrc && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="w-16 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <p className="text-xs text-gray-500">
                  {photoFile ? "Preview foto baru" : "Foto saat ini"}
                </p>
              </div>
            )}
          </div>

          {/* Preview card */}
          {form.name && previewSrc && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Preview tampilan</p>
              <div className="flex items-center gap-4">
                <img
                  src={previewSrc}
                  alt=""
                  className="w-14 h-18 object-cover rounded-xl border border-gray-200 shadow"
                  style={{ height: 72 }}
                />
                <div>
                  <p className="font-bold text-gray-800 text-sm">{form.name}</p>
                  {form.position && <p className="text-xs text-[#0A6F85] mt-0.5">{form.position}</p>}
                  <span className="text-[10px] bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 mt-1 inline-block capitalize">{form.type}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/board-members")}>
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
                <><Upload className="w-4 h-4 mr-2" />{isEdit ? "Simpan Perubahan" : "Simpan Anggota"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
