import { useState, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: 21, label: "Tahun Pengalaman", suffix: "+" },
  { value: 90, label: "Unit Kerja", suffix: "+" },
  { value: 3, label: "Lini Produk & Layanan", suffix: "" },
  { value: 100, label: "Anak PLN NPS", suffix: "%" }
];

function Counter({ from, to, suffix }: { from: number, to: number, suffix: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = from;
      const end = to;
      // Duration in ms
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / (end - start)));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [isInView, from, to]);

  return (
    <div ref={ref} className="text-5xl md:text-7xl font-black text-white mb-2 tabular-nums">
      {count}{suffix}
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-24 bg-secondary relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col items-center justify-center border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Counter from={0} to={stat.value} suffix={stat.suffix} />
              <div className="text-accent font-semibold tracking-wider uppercase text-sm md:text-base mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
