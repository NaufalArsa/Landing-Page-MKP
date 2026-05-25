import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Newspaper, ArrowLeft, Share2, Check, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { newsApi, type NewsItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsDetail() {
  const [, params] = useRoute("/news/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const id = params?.id ? parseInt(params.id) : null;

  const [item, setItem] = useState<NewsItem | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id || isNaN(id)) {
      navigate("/news");
      return;
    }

    setLoading(true);
    setCopied(false);

    // Fetch detail and latest news
    Promise.all([
      newsApi.get(id),
      newsApi.list("published"),
    ])
      .then(([detail, list]) => {
        setItem(detail);
        // Filter out current news and get top 3 latest
        const filtered = list
          .filter((n) => n.id !== detail.id)
          .slice(0, 4);
        setLatestNews(filtered);
      })
      .catch((err) => {
        console.error("Gagal memuat berita:", err);
        navigate("/news");
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleShare() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        toast({
          title: "Tautan Disalin",
          description: "Tautan artikel berita telah berhasil disalin ke clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin tautan:", err);
      });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-32">
          <div className="w-10 h-10 border-4 border-[#01B1D7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Memuat artikel berita...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />

      {/* Hero Header */}
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
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-accent/80 text-sm font-medium mb-4 flex-wrap">
              <Link href="/">
                <a className="hover:text-white transition-colors">Beranda</a>
              </Link>
              <span>/</span>
              <Link href="/news">
                <a className="hover:text-white transition-colors">Berita</a>
              </Link>
              <span>/</span>
              {item.category && (
                <>
                  <span className="text-white/70">{item.category}</span>
                  <span>/</span>
                </>
              )}
              <span className="text-white truncate max-w-xs md:max-w-md">{item.title}</span>
            </div>

            {/* Category and Date row */}
            <div className="flex items-center gap-3 mb-4">
              {item.category && (
                <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {item.category}
                </span>
              )}
              <div className="flex items-center text-white/80 text-sm">
                <Calendar className="w-4 h-4 mr-1.5 text-accent" />
                <span>{formatDate(item.publishedAt ?? item.createdAt)}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-4xl">
              {item.title}
            </h1>
            <div className="mt-6 w-20 h-1.5 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-4 md:p-6"
              >
                {/* Back Link & Share Buttons */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                  <Link href="/news">
                    <a className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors group">
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Kembali ke Berita
                    </a>
                  </Link>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:border-accent rounded-xl text-xs font-medium text-gray-600 hover:text-accent bg-white transition-all hover:shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Bagikan"}</span>
                  </button>
                </div>

                {/* Featured Image */}
                <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-50 aspect-video shadow-inner group">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/10 to-accent/10">
                      <Newspaper size={64} className="text-secondary/20 mb-2" />
                      <span className="text-gray-400 text-sm">Tidak ada gambar</span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                {item.content ? (
                  <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line px-1 md:px-3">
                    {item.content}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Tidak ada konten untuk berita ini.</p>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar Column */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6"
              >
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                  <Clock className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-secondary text-lg">Berita Terbaru</h3>
                </div>

                {latestNews.length === 0 ? (
                  <p className="text-sm text-gray-400">Tidak ada berita terbaru lainnya.</p>
                ) : (
                  <div className="space-y-5">
                    {latestNews.map((news) => (
                      <Link key={news.id} href={`/news/${news.id}`}>
                        <a className="group flex gap-4 items-start hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {news.imageUrl ? (
                              <img
                                src={news.imageUrl}
                                alt={news.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <Newspaper size={20} className="text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
                              {news.category ?? "Berita"}
                            </span>
                            <h4 className="text-sm font-bold text-secondary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {news.title}
                            </h4>
                            <span className="text-[11px] text-gray-400 mt-1 block">
                              {formatDate(news.publishedAt ?? news.createdAt)}
                            </span>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
