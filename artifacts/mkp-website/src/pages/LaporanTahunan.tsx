import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Download, FileText, Loader2 } from "lucide-react";

interface AnnualReport {
  id: number;
  year: number;
  title: string;
  description: string | null;
  pdfUrl: string;
  coverImageUrl: string | null;
  createdAt: string;
}

function BookCover({ report, index }: { report: AnnualReport; index: number }) {
  const colors = [
    "from-[#0A6F85] to-[#01B1D7]",
    "from-[#337AB7] to-[#0A6F85]",
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
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Book cover */}
      <div className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-400 cursor-pointer"
        style={{ aspectRatio: "3/4" }}
        onClick={() => window.open(report.pdfUrl, "_blank")}
      >
        {report.coverImageUrl ? (
          <img
            src={report.coverImageUrl}
            alt={`Cover ${report.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-between p-8`}>
            {/* Book spine decoration */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 rounded-l-xl" />
            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/10" />

            {/* Top logo area */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase">
                PT. Mitra Karya Prima
              </p>
            </div>

            {/* Year */}
            <div className="text-center">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Laporan Tahunan</p>
              <p className="text-white font-extrabold text-6xl leading-none drop-shadow-lg">
                {report.year}
              </p>
            </div>

            {/* Bottom bar */}
            <div className="w-full h-1.5 bg-white/30 rounded-full" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white rounded-full p-3 shadow-xl">
            <FileText className="w-6 h-6 text-secondary" />
          </div>
        </div>
      </div>

      {/* Book info */}
      <div className="mt-4 px-1">
        <p className="text-xs font-bold text-accent uppercase tracking-wide mb-1">{report.year}</p>
        <h3 className="font-bold text-secondary text-base leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {report.title}
        </h3>
        {report.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{report.description}</p>
        )}
        <a
          href={report.pdfUrl}
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

export default function LaporanTahunan() {
  const [reports, setReports] = useState<AnnualReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/annual-reports")
      .then((r) => r.json())
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Page Header */}
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
              <span>Tata Kelola</span>
              <span>/</span>
              <span className="text-white">Laporan Tahunan</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Laporan Tahunan
            </h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <BookOpen size={52} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Belum ada laporan tahunan</p>
              <p className="text-sm mt-1 text-center">
                Laporan tahunan akan ditampilkan di sini setelah diunggah oleh admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {reports.map((r, i) => (
                <BookCover key={r.id} report={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
