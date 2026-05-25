import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Briefcase, Download, FileText, Loader2,
  ExternalLink, ArrowDown, Calendar, UserCheck
} from "lucide-react";

interface CareerItem {
  id: number;
  title: string;
  coverImageUrl: string | null;
  fileUrl: string;
  createdAt: string;
}

export default function Karir() {
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const announcementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/careers")
      .then((r) => r.json())
      .then((data) => setCareers(Array.isArray(data) ? data : []))
      .catch(() => setCareers([]))
      .finally(() => setLoading(false));
  }, []);

  const scrollToAnnouncements = () => {
    announcementsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

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
              <span>Karir</span>
              <span>/</span>
              <span className="text-white">Informasi Lowongan</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Karir & Rekrutmen
            </h1>
            <p className="text-white/80 mt-2 text-sm md:text-base max-w-xl">
              Bergabunglah bersama PT. Mitra Karya Prima untuk berkontribusi dalam mendukung ketahanan energi nasional.
            </p>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* 2 Big Menus */}
      <section className="py-16 bg-gray-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* E-Rekrut Menu */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#01B1D7] to-[#337AB7] rounded-xl flex items-center justify-center text-white mb-6 shadow-md shadow-[#01B1D7]/20 group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-secondary mb-3">E-Rekrut</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Sistem rekrutmen elektronik resmi PT. Mitra Karya Prima. Daftarkan diri Anda, buat profil profesional, dan lamar lowongan pekerjaan yang tersedia secara online.
                </p>
              </div>
              <a
                href="https://rekrutmen.mitrakaryaprima.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0A6F85] hover:bg-[#01B1D7] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md shadow-[#0A6F85]/10 hover:shadow-lg hover:shadow-[#01B1D7]/20"
              >
                Kunjungi E-Rekrut
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Pengumuman Menu */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#0A6F85] to-[#01B1D7] rounded-xl flex items-center justify-center text-white mb-6 shadow-md shadow-[#0A6F85]/20 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-secondary mb-3">Pengumuman</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Dapatkan informasi terbaru mengenai pengumuman hasil seleksi berkas/administrasi, jadwal tes, psikotes, wawancara kerja, dan pengumuman hasil akhir rekrutmen.
                </p>
              </div>
              <button
                onClick={scrollToAnnouncements}
                className="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/95 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md shadow-secondary/10 hover:shadow-lg"
              >
                Lihat Pengumuman
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements List Section */}
      <section ref={announcementsRef} id="announcements" className="py-20 flex-1">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-secondary mb-3">
              Pengumuman Karir Terbaru
            </h2>
            <div className="w-12 h-1 bg-accent mx-auto mb-4 rounded-full" />
            <p className="text-gray-500 text-sm">
              Silakan unduh dokumen berkas resmi pengumuman lowongan atau hasil tahapan seleksi karir di bawah ini.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : careers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 max-w-md mx-auto">
              <Briefcase size={52} className="mb-4 opacity-30 text-[#0A6F85]" />
              <p className="text-lg font-bold text-gray-600">Belum ada pengumuman</p>
              <p className="text-sm mt-1 text-center text-gray-400">
                Semua berkas pengumuman seleksi atau kelulusan karir akan diunggah dan ditampilkan di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {careers.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  <div className="relative h-48 bg-gradient-to-br from-[#0A6F85] to-[#01B1D7] flex items-center justify-center overflow-hidden">
                    {c.coverImageUrl ? (
                      <img
                        src={c.coverImageUrl}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-white text-center p-4">
                        <Briefcase className="w-10 h-10 mb-2 opacity-60" />
                        <span className="text-xs font-bold tracking-wide uppercase opacity-85">PT MKP Karir</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#0A6F85] uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(c.createdAt)}
                      </div>
                      <h3 className="font-extrabold text-secondary text-base leading-snug line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                        {c.title}
                      </h3>
                    </div>
                    <a
                      href={c.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:text-white border border-primary/30 hover:bg-primary rounded-xl py-2.5 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Unduh Berkas / Detail
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
