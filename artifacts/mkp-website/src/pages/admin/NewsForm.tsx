import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { newsApi, type NewsItem } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const CATEGORIES = [
  "Umum",
  "Operasional",
  "SDM",
  "K3",
  "CSR",
  "Kemitraan",
  "Pengumuman",
];

export default function NewsForm() {
  const [, navigate] = useLocation();
  const [matchEdit, params] = useRoute("/admin/berita/:id");
  const isEdit = matchEdit && params?.id !== "baru";
  const editId = isEdit ? parseInt(params!.id) : null;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    category: "" as string | undefined,
    status: "draft" as "draft" | "published" | "archived",
    imageUrl: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editId) return;
    newsApi.get(editId).then((item: NewsItem) => {
      setForm({
        title: item.title,
        slug: item.slug,
        category: item.category ?? "",
        status: item.status,
        imageUrl: item.imageUrl ?? "",
        content: item.content ?? "",
      });
      setSlugManual(true);
    }).catch(() => navigate("/admin/berita")).finally(() => setFetching(false));
  }, [editId]);

  function handleTitleChange(v: string) {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugManual ? f.slug : slugify(v),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("slug", form.slug);
      formData.append("category", form.category || "");
      formData.append("status", form.status);
      if (form.content) formData.append("content", form.content);
      if (imageFile) formData.append("image", imageFile);

      if (editId) {
        await newsApi.update(editId, formData);
      } else {
        await newsApi.create(formData);
      }
      navigate("/admin/berita");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#01B1D7] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/berita">
            <a className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <ArrowLeft size={18} />
            </a>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Edit Berita" : "Tambah Berita Baru"}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {isEdit ? "Perbarui informasi artikel" : "Buat artikel berita baru"}
            </p>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Informasi Artikel</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40"
                placeholder="Masukkan judul berita..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug URL *
                <span className="text-gray-400 font-normal ml-1">(otomatis dari judul)</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 whitespace-nowrap">berita/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 font-mono"
                  placeholder="judul-berita-anda"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Berita</label>
              <select
                value={form.category || ""}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 bg-white"
              >
                <option value="">Tanpa Kategori</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof f.status }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Dipublikasikan</option>
                  <option value="archived">Diarsipkan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Berita</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  } else {
                    setImageFile(null);
                    setImagePreview("");
                  }
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 bg-white"
              />
              {(imagePreview || form.imageUrl) && (
                <img
                  src={imagePreview || form.imageUrl}
                  alt="preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg border border-gray-200"
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Isi Artikel</h2>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#01B1D7]/40 resize-y"
              placeholder="Tulis isi berita di sini..."
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/admin/berita">
              <a className="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Batal
              </a>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#0A6F85] hover:bg-[#01B1D7] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {loading ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Simpan Berita")}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
