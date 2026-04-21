import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Eye, Target } from "lucide-react";

const visi =
  "Menjadi Penyedia Layanan Pendukung Kegiatan Penyediaan Tenaga Listrik dan Utilitas Industri yang Terpercaya di Indonesia dengan Komitmen pada Bisnis yang Berkelanjutan";

const misi = [
  "Menyediakan layanan terintegrasi yang andal dan terpercaya untuk mendukung pusat pembangkit listrik dan utilitas industri",
  "Mengembangkan inovasi layanan dan model bisnis termasuk lingkup usaha transisi energi guna memperkuat daya saing serta menciptakan nilai tambah yang berkelanjutan",
  "Mengoptimalkan pengelolaan sumber daya perusahaan melalui peningkatan kapabilitas, efisiensi, dan digitalisasi yang memberikan nilai tambah bagi stakeholder",
  "Meningkatkan kualitas dan kapabilitas sumber daya manusia melalui pengembangan kompetensi, kepemimpinan, dan budaya kerja yang adaptif serta berorientasi pada keunggulan",
];

export default function VisiMisi() {
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
              <span>Profil</span>
              <span>/</span>
              <span className="text-white">Visi &amp; Misi</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Visi &amp; Misi
            </h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-20">
        <div className="container mx-auto px-6 max-w-5xl space-y-20">

          {/* Visi */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary">Visi</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="relative bg-secondary rounded-2xl overflow-hidden shadow-lg">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 10% 50%, #01B1D7 0%, transparent 55%), radial-gradient(circle at 90% 50%, #337AB7 0%, transparent 55%)",
                }}
              />
              <div className="relative z-10 px-8 md:px-14 py-12 md:py-16">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-1 bg-accent rounded-full" />
                  <span className="text-accent uppercase tracking-widest text-xs font-bold">
                    Visi Perusahaan
                  </span>
                </div>
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-bold leading-relaxed">
                  {visi}
                </p>
              </div>
              {/* decorative corner accent */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-tl-[80px]" />
            </div>
          </motion.section>

          {/* Misi */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary">Misi</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <ol className="space-y-5">
              {misi.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex gap-5 items-start bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.1 }}
                >
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed pt-1.5">
                    {item}
                  </p>
                </motion.li>
              ))}
            </ol>
          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
