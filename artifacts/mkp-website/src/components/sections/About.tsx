import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
              <img 
                src="/images/about.png" 
                alt="PT MKP Corporate Headquarters" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-80" />
              
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl inline-block">
                  <div className="text-5xl font-extrabold text-white mb-1">2004</div>
                  <div className="text-white/90 font-medium">Tahun Berdiri</div>
                </div>
              </div>
            </div>
            
            {/* Decorative block */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-br-3xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-primary rounded-tl-3xl -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase mb-6">
              Kenali PT. MKP
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
              Mendukung Pertumbuhan <span className="text-primary">Energi Nasional</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              PT Mitra Karya Prima (PT MKP) adalah anak perusahaan dari PT PLN Nusantara Power Services (PLN NPS) dengan komposisi saham 92% dan 8% dimiliki oleh YK PT PLN NP. 
            </p>
            
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Didirikan pada tahun 2004, PT MKP telah berkembang menjadi pemain kunci dalam penyediaan jasa pendukung operasi dan pemeliharaan pembangkit listrik di seluruh Indonesia.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Standar Keamanan dan K3 yang Ketat",
                "Tenaga Profesional yang Tersertifikasi",
                "Inovasi Berkelanjutan di Sektor Energi"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-secondary font-semibold">
                  <CheckCircle className="w-6 h-6 text-accent mr-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 group">
              Tentang Kami
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
