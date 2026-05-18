import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShoppingBag, Download, FileText, Loader2 } from "lucide-react";

interface PengadaanItem {
  id: number;
  title: string;
  description: string | null;
  pdfUrl: string;
  coverImageUrl: string;
  createdAt: string;
}

function BookCover({ item, index }: { item: PengadaanItem; index: number }) {
  const colors = [
    "from-[#337AB7] to-[#0A6F85]",
    "from-[#0A6F85] to-[#01B1D7]",
    "from-[#1a5276] to-[#337AB7]",
    "from-[#0e6655] to-[#0A6F85]",
  ];
  const gradient = colors[index % colors.length];

  return (
    <motion.div
      className="group flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
    >
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-400 cursor-pointer"
        style={{ aspectRatio: "3/4" }}
        onClick={() => window.open(item.pdfUrl, "_blank")}
      >
        <img
          src={item.coverImageUrl}
          alt={`Cover ${item.title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-xl">
            <FileText className="w-6 h-6 text-[#337AB7]" />
          </div>
        </div>
      </div>

      <div className="mt-4 px-1">
        <h3 className="font-bold text-secondary text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        {item.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{item.description}</p>
        )}
        <a
          href={item.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary border border-primary/30 hover:border-secondary/50 rounded-full px-4 py-1.5 transition-all hover:bg-secondary/5"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="w-3.5 h-3.5" />
          Unduh PDF
        </a>
      </div>
    </motion.div>
  );
}

export default function Pengadaan() {
  const [items, setItems] = useState<PengadaanItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pengadaan")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="bg-[#337AB7] pt-32 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #01B1D7 0%, transparent 60%), radial-gradient(circle at 80% 50%, #0A6F85 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium mb-3">
              <span>Beranda</span>
              <span>/</span>
              <span className="text-white">Pengadaan</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">Pengadaan</h1>
            <div className="mt-4 w-16 h-1 bg-[#01B1D7] rounded-full" />
          </motion.div>
        </div>
      </div>

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[#01B1D7]" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <ShoppingBag size={52} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Belum ada dokumen pengadaan</p>
              <p className="text-sm mt-1 text-center">
                Dokumen pengadaan akan ditampilkan di sini setelah diunggah oleh admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {items.map((item, i) => (
                <BookCover key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
