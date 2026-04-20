import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-[#053d4a] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <img
              src="https://mitrakaryaprima.com/wp-content/uploads/2019/04/cropped-logo-mkp.png"
              alt="PT MKP Logo"
              className="h-12 object-contain mb-6 bg-white/10 p-2 rounded"
            />
            <p className="text-white/80 mb-6 max-w-md leading-relaxed">
              Mendukung ketahanan energi nasional sebagai anak perusahaan terpercaya dari PT PLN Nusantara Power Services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#about" className="hover:text-accent transition-colors">Tentang Kami</a></li>
              <li><a href="#products" className="hover:text-accent transition-colors">Produk & Layanan</a></li>
              <li><a href="#sustainability" className="hover:text-accent transition-colors">Sustainability</a></li>
              <li><a href="#news" className="hover:text-accent transition-colors">Berita</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Karir</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-accent flex-shrink-0 mt-0.5" />
                <span>Jl. Ketintang Baru No. 11, Surabaya, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                <span>+62 31 828 3180</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-accent flex-shrink-0" />
                <span>info@mitrakaryaprima.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© 2024 PT. Mitra Karya Prima. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
