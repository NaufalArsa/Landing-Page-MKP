import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Values } from "@/components/sections/Values";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Products } from "@/components/sections/Products";
import { News } from "@/components/sections/News";

export default function Home() {
  return (
    <main className="min-h-screen font-sans bg-white text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <Values />
      <About />
      <Stats />
      <Products />
      <News />
      <Footer />
    </main>
  );
}
