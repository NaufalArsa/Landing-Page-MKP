import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Menu, X, Globe, ChevronDown } from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  dropdown?: { label: string; href: string }[];
};

const navLinks: NavItem[] = [
  {
    name: "Profil",
    href: "#about",
    dropdown: [
      { label: "Tentang Kami", href: "#about" },
      { label: "Sambutan Direktur Utama", href: "/profil/sambutan-direksi" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "#about" },
      { label: "Dewan Direksi", href: "#about" },
      { label: "Dewan Komisaris", href: "#about" },
    ],
  },
  {
    name: "Tata Kelola",
    href: "#values",
    dropdown: [
      { label: "Whistle Blowing", href: "/tata-kelola/whistle-blowing" },
      { label: "Laporan Tahunan", href: "#values" },
      { label: "GCG", href: "#values" },
      { label: "Laporan Gratifikasi", href: "#values" },
      { label: "Surat Keputusan Direksi", href: "#values" },
    ],
  },
  {
    name: "Produk dan Layanan",
    href: "#products",
    dropdown: [
      { label: "Operation Supporting Product", href: "#products" },
      { label: "MRO Supporting Product", href: "#products" },
      { label: "Clean & Renewable Energy Supporting Product", href: "#products" },
    ],
  },
  { name: "Berita MKP", href: "#news" },
  { name: "Media", href: "#media" },
  { name: "Pengadaan", href: "#procurement" },
  { name: "Hubungi Kami", href: "#footer" },
];

function DropdownMenu({ items, onClose }: { items: { label: string; href: string }[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-gray-100">
      {items.map((item, i) => {
        const isInternal = item.href.startsWith("/");
        return isInternal ? (
          <Link key={i} href={item.href}>
            <span
              className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary font-medium border-b border-gray-50 last:border-0 transition-colors cursor-pointer"
              onClick={onClose}
            >
              {item.label}
            </span>
          </Link>
        ) : (
          <a
            key={i}
            href={item.href}
            className="block px-5 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary font-medium border-b border-gray-50 last:border-0 transition-colors"
            onClick={onClose}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-secondary/95 backdrop-blur-sm py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between" ref={navRef}>
          {/* Logo */}
          <Link href="/">
            <img
              src="https://mitrakaryaprima.com/wp-content/uploads/2019/04/cropped-logo-mkp.png"
              alt="PT MKP Logo"
              className="h-10 md:h-12 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <li key={link.name} className="relative">
                  {link.dropdown ? (
                    <button
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white/90 hover:text-white transition-colors uppercase tracking-wide whitespace-nowrap"
                    >
                      {link.name}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="flex items-center px-3 py-2 text-xs font-semibold text-white/90 hover:text-white transition-colors uppercase tracking-wide whitespace-nowrap"
                    >
                      {link.name}
                    </a>
                  )}

                  {link.dropdown && activeDropdown === link.name && (
                    <div
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <DropdownMenu items={link.dropdown} onClose={() => setActiveDropdown(null)} />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center space-x-2 border-l border-white/20 pl-4 ml-2 text-white">
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

          {/* Mobile Toggle */}
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-secondary border-t border-white/10 shadow-lg max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col py-4 px-6 space-y-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block text-white font-semibold text-base uppercase py-3 border-b border-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
                {link.dropdown && (
                  <ul className="pl-4 pb-2 space-y-1">
                    {link.dropdown.map((sub, i) => (
                      <li key={i}>
                        <a
                          href={sub.href}
                          className="block text-white/70 text-sm py-2 hover:text-white transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-4 flex items-center space-x-3 text-white border-t border-white/10 mt-2">
              <Globe className="w-5 h-5" />
              <div className="flex space-x-2">
                <button onClick={() => { setLang("ID"); setMobileMenuOpen(false); }} className={`font-bold ${lang === "ID" ? "text-white" : "text-white/50"}`}>ID</button>
                <span className="text-white/30">|</span>
                <button onClick={() => { setLang("EN"); setMobileMenuOpen(false); }} className={`font-bold ${lang === "EN" ? "text-white" : "text-white/50"}`}>EN</button>
              </div>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
