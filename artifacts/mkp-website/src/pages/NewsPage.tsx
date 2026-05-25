import { useEffect, useState } from "react";
import { Calendar, Newspaper, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { newsApi, type NewsItem } from "@/lib/api";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-64 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-28 bg-gray-200 rounded-full" />
        <div className="h-5 bg-gray-200 rounded-lg" />
        <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
        <div className="h-4 w-24 bg-gray-100 rounded-full mt-4" />
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi
      .list("published")
      .then(setItems)
      .catch(() => setItems([]))
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
              <span>Beranda</span>
              <span>/</span>
              <span className="text-white">Berita MKP</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">Berita MKP</h1>
            <p className="text-white/80 mt-4 max-w-2xl text-lg">
              Informasi, kegiatan, dan kabar terbaru seputar PT. Mitra Karya Prima.
            </p>
            <div className="mt-6 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Newspaper size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Belum ada berita yang dipublikasikan</p>
              <p className="text-sm mt-1">Berita akan tampil di sini setelah dipublikasikan oleh admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, i) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <a className="block group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 h-full">
                    <motion.div
                      className="flex flex-col h-full"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: (i % 3) * 0.15 }}
                    >
                      <div className="relative h-64 overflow-hidden bg-gray-100 rounded-t-2xl">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                            <Newspaper size={40} className="text-secondary/30" />
                          </div>
                        )}
                        {item.category?.trim() && (
                          <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                            {item.category}
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="w-4 h-4 mr-2 text-accent" />
                          {formatDate(item.publishedAt ?? item.createdAt)}
                        </div>

                        <h3 className="text-xl font-bold text-secondary mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                          {item.title}
                        </h3>

                        {item.content && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {item.content}
                          </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-primary font-semibold text-sm">
                          Baca Selengkapnya
                          <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
