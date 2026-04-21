import { useEffect, useState } from "react";
import { Calendar, ChevronRight, ArrowRight, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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

export function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi
      .list("published")
      .then((data) => setItems(data.slice(0, 3)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="news" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl mb-6 md:mb-0">
            <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-secondary font-bold text-sm tracking-wide uppercase mb-6 border border-accent/20">
              Pembaruan Info
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-secondary">
              Berita MKP Terbaru
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-secondary text-secondary hover:bg-secondary hover:text-white rounded-full"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            Lihat Semua Berita
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Newspaper size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Belum ada berita yang dipublikasikan</p>
            <p className="text-sm mt-1">Berita akan tampil di sini setelah dipublikasikan melalui panel admin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
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
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
