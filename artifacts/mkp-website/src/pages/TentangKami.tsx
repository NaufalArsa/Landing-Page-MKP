import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TentangKami() {
  return (
    <main className="min-h-screen font-sans bg-white text-foreground selection:bg-primary selection:text-white">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-accent/80 text-sm font-medium mb-3">
              <span>Profil</span><span>/</span>
              <span className="text-white">Tentang Kami</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Tentang PT. Mitra Karya Prima
            </h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            <motion.div
              className="w-full lg:w-1/2 relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/DRv05dHB3dU?si=FGRMlh4NwQLT9wzY"
                  title="Jingle PT Mitra Karya Prima"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Decorative block */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-br-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-primary rounded-tl-3xl -z-10" />
            </motion.div>

            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl font-bold text-secondary mb-6 leading-tight">
                Mendukung Pertumbuhan Energi Nasional
              </h2>
              
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                PT Mitra Karya Prima (PT MKP) adalah anak perusahaan dari PT PLN Nusantara Power Services (PLN NPS) dengan komposisi saham 92% dan 8% dimiliki oleh YK PT PLN NP. 
              </p>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Didirikan pada tahun 2004, PT MKP telah berkembang menjadi pemain kunci dalam penyediaan jasa pendukung operasi dan pemeliharaan pembangkit listrik di seluruh Indonesia.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
