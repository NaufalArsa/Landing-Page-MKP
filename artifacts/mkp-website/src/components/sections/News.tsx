import { Calendar, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Bulan K3 Nasional 2026",
    date: "12 Jan 2026",
    image: "/images/news-1.png",
    category: "Keselamatan"
  },
  {
    id: 2,
    title: "Pembangkit yang Andal Harapan Bagi Jutaan Orang di Indonesia",
    date: "8 Des 2025",
    image: "/images/news-2.png",
    category: "Operasional"
  },
  {
    id: 3,
    title: "MKP MENGUKIR PRESTASI DI AJANG EAST 2025 PT PLN NUSANTARA POWER SERVICES",
    date: "1 Des 2025",
    image: "/images/news-3.png",
    category: "Penghargaan"
  }
];

export function News() {
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
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white rounded-full">
            Lihat Semua Berita
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, i) => (
            <motion.div 
              key={item.id}
              className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {item.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-2 text-accent" />
                  {item.date}
                </div>
                
                <h3 className="text-xl font-bold text-secondary mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                  {item.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-primary font-semibold text-sm">
                  Baca Selengkapnya
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
