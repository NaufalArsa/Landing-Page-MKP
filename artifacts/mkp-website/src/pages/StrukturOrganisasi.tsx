import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Network, Loader2, ZoomIn } from "lucide-react";

interface OrgStructure {
  id: number;
  imageUrl: string;
  updatedAt: string;
}

export default function StrukturOrganisasi() {
  const [data, setData] = useState<OrgStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    fetch("/api/org-structure")
      .then((r) => r.json())
      .then((d) => setData(d ?? null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="bg-secondary pt-32 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #01B1D7 0%, transparent 60%), radial-gradient(circle at 80% 50%, #337AB7 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-accent/80 text-sm font-medium mb-3">
              <span>Profil</span>
              <span>/</span>
              <span className="text-white">Struktur Organisasi</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">Struktur Organisasi</h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : !data ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Network size={52} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Struktur organisasi belum tersedia</p>
              <p className="text-sm mt-1 text-center">
                Bagan organisasi akan ditampilkan di sini setelah diunggah oleh admin.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 cursor-zoom-in bg-gray-50"
                onClick={() => setZoomed(true)}
              >
                <img
                  src={data.imageUrl}
                  alt="Struktur Organisasi PT. Mitra Karya Prima"
                  className="w-full h-auto object-contain"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600 shadow">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Klik untuk perbesar
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {zoomed && data && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <img
            src={data.imageUrl}
            alt="Struktur Organisasi"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
