import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const misi = [
  "Menyediakan layanan terintegrasi yang andal dan terpercaya untuk mendukung pusat pembangkit listrik dan utilitas industri",
  "Mengembangkan inovasi layanan dan model bisnis termasuk lingkup usaha transisi energi guna memperkuat daya saing serta menciptakan nilai tambah yang berkelanjutan",
  "Mengoptimalkan pengelolaan sumber daya perusahaan melalui peningkatan kapabilitas, efisiensi, dan digitalisasi yang memberikan nilai tambah bagi stakeholder",
  "Meningkatkan kualitas dan kapabilitas sumber daya manusia melalui pengembangan kompetensi, kepemimpinan, dan budaya kerja yang adaptif serta berorientasi pada keunggulan",
];

const slides = [
  { image: "/images/hero-1.png", type: "visi" as const },
  { image: "/images/hero-2.png", type: "misi" as const },
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);
  const scrollTo = useCallback((index: number) => { if (emblaApi) emblaApi.scrollTo(index); }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 7000);
    return () => { emblaApi.off("select", onSelect); clearInterval(interval); };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black" aria-label="Hero Carousel">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full flex-[0_0_100%] min-w-0">
              <div className="absolute inset-0 bg-black/60 z-10" />
              <img src={slide.image} alt={`Slide ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />

              {/* Slide 1 — Visi */}
              {slide.type === "visi" && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="container mx-auto px-6 md:px-16 text-white max-w-4xl text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-10 h-1 bg-accent rounded-full" />
                        <span className="text-accent uppercase tracking-widest text-sm font-bold">Visi</span>
                        <span className="w-10 h-1 bg-accent rounded-full" />
                      </div>
                      <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed text-white">
                        Menjadi Penyedia Layanan Pendukung Kegiatan Penyediaan Tenaga Listrik dan Utilitas Industri yang Terpercaya di Indonesia dengan Komitmen pada Bisnis yang Berkelanjutan
                      </p>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Slide 2 — Misi */}
              {slide.type === "misi" && (
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="container mx-auto px-6 md:px-16 text-white max-w-5xl">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <span className="w-10 h-1 bg-accent rounded-full" />
                        <span className="text-accent uppercase tracking-widest text-sm font-bold">Misi</span>
                      </div>
                      <ol className="space-y-5">
                        {misi.map((item, i) => (
                          <li key={i} className="flex gap-4 text-white/90 text-base md:text-lg leading-relaxed">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 border border-accent/60 text-accent text-sm font-bold flex items-center justify-center mt-0.5">
                              {i + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none" aria-label="Previous slide">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none" aria-label="Next slide">
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-accent w-10" : "bg-white/50 hover:bg-white/80 w-3"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
