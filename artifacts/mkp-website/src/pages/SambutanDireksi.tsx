import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Quote } from "lucide-react";

const paragraphs = [
  "Dengan penuh rasa syukur, kami panjatkan ke hadirat Tuhan Yang Maha Esa atas kepercayaan dan dukungan yang terus diberikan kepada PT Mitra Karya Prima (MKP).",
  "Sebagai perusahaan yang bergerak di bidang layanan pendukung penyediaan tenaga listrik dan utilitas industri, PT MKP berkomitmen untuk senantiasa memberikan layanan terbaik yang andal, efisien, dan berkelanjutan. Kami menyadari bahwa di tengah dinamika industri yang terus berkembang, adaptasi terhadap perubahan dan inovasi merupakan kunci utama dalam menjaga daya saing perusahaan.",
  "Sejalan dengan visi perusahaan untuk menjadi penyedia layanan yang terpercaya di Indonesia, kami terus memperkuat kapabilitas organisasi melalui pengembangan sumber daya manusia, pemanfaatan teknologi, serta peningkatan kualitas layanan. Kami juga berkomitmen untuk mendukung transisi energi dan praktik bisnis yang berkelanjutan guna memberikan nilai tambah bagi seluruh pemangku kepentingan.",
  "Kami percaya bahwa keberhasilan PT MKP tidak terlepas dari sinergi yang kuat antara manajemen, karyawan, mitra kerja, serta kepercayaan dari para pelanggan. Oleh karena itu, kami akan terus menjaga integritas, profesionalisme, dan komitmen dalam setiap langkah yang kami ambil.",
  "Akhir kata, kami mengucapkan terima kasih atas kepercayaan yang telah diberikan, dan kami berharap PT MKP dapat terus tumbuh dan memberikan kontribusi terbaik bagi industri, masyarakat, dan bangsa.",
];

export default function SambutanDireksi() {
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
              <span className="text-white">Sambutan Direktur Utama</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Sambutan Direktur Utama
            </h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-14 items-start">
            {/* Photo */}
            <motion.div
              className="w-full lg:w-80 flex-shrink-0"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/direktur.png"
                    alt="Direktur Utama PT MKP"
                    className="w-full object-cover"
                  />
                </div>
                {/* Name card */}
                <div className="mt-5 bg-secondary rounded-xl p-5 text-white text-center shadow-lg">
                  <div className="font-bold text-lg leading-tight">
                    Hendra Hartanto Efendi
                  </div>
                  <div className="text-accent text-sm font-semibold mt-1">
                    Direktur Utama
                  </div>
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-br-3xl -z-10" />
                <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-primary/30 rounded-tl-3xl -z-10" />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <Quote className="w-8 h-8 text-accent flex-shrink-0" />
                <h2 className="text-2xl md:text-3xl font-bold text-secondary">
                  Kata Sambutan
                </h2>
              </div>

              <div className="space-y-6">
                {paragraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    className="text-gray-600 text-base md:text-lg leading-relaxed"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              <motion.div
                className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="w-12 h-1 bg-accent rounded-full" />
                <div>
                  <div className="font-bold text-secondary text-lg">
                    Direktur Utama
                  </div>
                  <div className="text-sm text-gray-500">
                    PT Mitra Karya Prima
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
