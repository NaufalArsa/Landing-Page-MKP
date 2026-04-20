import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero-1.png",
    title: "Mendukung Ketahanan Energi Nasional",
    subtitle: "Anak Perusahaan PT PLN Nusantara Power Services",
  },
  {
    image: "/images/hero-2.png",
    title: "Keandalan Operasi & Pemeliharaan",
    subtitle: "Standar Global untuk Kinerja Pembangkit Maksimal",
  },
  {
    image: "/images/hero-3.png",
    title: "Transisi Energi Bersih & Terbarukan",
    subtitle: "Berkomitmen pada Masa Depan Berkelanjutan",
  }
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    // Auto-play
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black" aria-label="Hero Carousel">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full flex-[0_0_100%] min-w-0">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="container mx-auto px-4 md:px-6 text-center text-white">
                  <div
                    className="max-w-4xl mx-auto opacity-0 translate-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-forwards"
                    style={{ animationDelay: "300ms" }}
                  >
                    <h2 className="text-xl md:text-2xl font-bold tracking-widest text-accent mb-4 uppercase">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8 text-balance">
                      {slide.title}
                    </h1>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg font-semibold group">
                      Lihat Lebih
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/20 hover:bg-black/50 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "bg-accent w-10" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
