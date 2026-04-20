import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tentang Kami", href: "#about" },
    { name: "Produk & Layanan", href: "#products" },
    { name: "Sustainability", href: "#sustainability" },
    { name: "Berita", href: "#news" },
    { name: "Kontak", href: "#footer" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-secondary/95 backdrop-blur-sm py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <img
              src="https://mitrakaryaprima.com/wp-content/uploads/2019/04/cropped-logo-mkp.png"
              alt="PT MKP Logo"
              className="h-10 md:h-12 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-white/90 hover:text-white transition-colors uppercase tracking-wide"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-2 border-l border-white/20 pl-6 text-white">
              <Globe className="w-4 h-4" />
              <button
                onClick={() => setLang("ID")}
                className={`text-sm font-bold ${lang === "ID" ? "text-white" : "text-white/50"}`}
              >
                ID
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => setLang("EN")}
                className={`text-sm font-bold ${lang === "EN" ? "text-white" : "text-white/50"}`}
              >
                EN
              </button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-secondary border-t border-white/10 shadow-lg">
          <ul className="flex flex-col py-4 px-6 space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block text-white font-medium text-lg uppercase py-2 border-b border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="pt-4 flex items-center space-x-3 text-white">
              <Globe className="w-5 h-5" />
              <div className="flex space-x-2">
                <button
                  onClick={() => { setLang("ID"); setMobileMenuOpen(false); }}
                  className={`font-bold ${lang === "ID" ? "text-white" : "text-white/50"}`}
                >
                  ID
                </button>
                <span className="text-white/30">|</span>
                <button
                  onClick={() => { setLang("EN"); setMobileMenuOpen(false); }}
                  className={`font-bold ${lang === "EN" ? "text-white" : "text-white/50"}`}
                >
                  EN
                </button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
