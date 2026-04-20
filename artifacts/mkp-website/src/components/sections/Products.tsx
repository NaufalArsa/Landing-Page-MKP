import { ArrowRight, Wrench, Settings, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: "mro",
    title: "MAINTENANCE, REPAIR, OVERHAUL (MRO)",
    subtitle: "SUPPORTING PRODUCT",
    image: "/images/product-1.png",
    icon: Wrench,
    items: [
      "Jasa Pendukung Proyek",
      "Jasa Overhaul Alat Berat",
      "Jasa Consumable Material"
    ],
    color: "from-primary/90 to-secondary/90"
  },
  {
    id: "ops",
    title: "OPERATION SUPPORTING",
    subtitle: "PRODUCT",
    image: "/images/product-2.png",
    icon: Settings,
    items: [
      "Jasa Pendukung Teknik",
      "Jasa Pendukung Operasi",
      "Jasa Pendukung Administrasi",
      "Jasa Pendukung RLA"
    ],
    color: "from-secondary/90 to-[#053d4a]/90"
  },
  {
    id: "clean",
    title: "CLEAN & RENEWABLE ENERGY",
    subtitle: "SUPPORTING PRODUCT",
    image: "/images/product-3.png",
    icon: Sun,
    items: [
      "Jasa Electric Vehicle",
      "Jasa Pendukung Pembangkit EBT (PLTA, PLTS)"
    ],
    color: "from-accent/90 to-primary/90"
  }
];

export function Products() {
  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide uppercase mb-6">
            Lini Bisnis
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-6">
            Produk & Layanan
          </h2>
          <p className="text-gray-600 text-lg">
            Solusi komprehensif untuk mendukung keandalan dan efisiensi operasi pembangkit energi di seluruh Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((product, i) => {
            const Icon = product.icon;
            return (
              <motion.div 
                key={product.id}
                className="group relative rounded-2xl overflow-hidden shadow-lg h-[500px] flex flex-col justify-end"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-90 group-hover:opacity-95 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-auto border border-white/30 group-hover:bg-white group-hover:text-primary transition-colors text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <div>
                    <h4 className="text-accent font-bold tracking-wider text-sm mb-2">{product.subtitle}</h4>
                    <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{product.title}</h3>
                    
                    <ul className="space-y-3 mb-8">
                      {product.items.map((item, idx) => (
                        <li key={idx} className="text-white/90 flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button variant="outline" className="text-primary hover:bg-primary hover:text-white bg-white border-none rounded-full px-6 group-hover:w-full transition-all duration-300 w-auto overflow-hidden">
                      <span className="whitespace-nowrap">Selengkapnya</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
