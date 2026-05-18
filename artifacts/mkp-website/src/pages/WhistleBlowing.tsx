import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  X,
  ChevronDown,
  ChevronUp,
  Send,
  AlertCircle,
  CheckCircle2,
  Paperclip,
} from "lucide-react";

const faqs = [
  {
    q: "APA ITU WHISTLE BLOWING?",
    a: "Sistem Pelaporan Pelanggaran (Whistleblowing System) adalah sistem yang digunakan untuk menampung, mengolah dan menindaklanjuti serta membuat pelaporan atas informasi yang disampaikan oleh pelapor mengenai tindakan pelanggaran yang terjadi di lingkungan PT. Mitra Karya Prima.",
  },
  {
    q: "SIAPA ITU PELAPOR?",
    a: "Pelapor adalah personil atau badan hukum baik yang berasal dari lingkungan internal maupun eksternal perusahaan yang menyampaikan informasi mengenai kejadian atau indikasi tindakan pelanggaran melalui saluran yang disediakan oleh perusahaan.",
  },
  {
    q: "SIAPA ITU TERLAPOR?",
    a: "Terlapor adalah Direksi, Dewan Komisaris, Organ Pendukung, Dewan Komisaris dan seluruh Karyawan Perusahaan termasuk Karyawan yang ditugaskan di Anak perusahaan dan Perusahaan Afiliasi, serta personil lainnya yang secara langsung bekerja untuk dan atas nama Perusahaan.",
  },
  {
    q: "APA SAJA PERSYARATAN UNTUK MELAPOR?",
    a: "Pengaduan Pelanggaran secara tertulis harus dilengkapi fotokopi identitas bukti pendukung seperti dokumen yang berkaitan Pelanggaran yang akan disampaikan. Pelapor anonim dapat diterima tetapi tidak ada kewajiban Perusahaan untuk memberikan tanggapan karena akan terdapat kesulitan untuk melakukan komunikasi dan klarifikasi atas laporannya tersebut sehingga ada kemungkinan laporan tidak dapat diproses lebih lanjut.",
  },
  {
    q: "BAGAIMANA JIKA PELANGGARAN DIAJUKAN OLEH BADAN HUKUM / LEMBAGA?",
    a: "Apabila Pengaduan Pelanggaran diajukan oleh Badan Hukum/Lembaga maka selain dokumen di atas juga diserahkan dokumen lainnya yaitu:\n• Fotokopi bukti identitas Badan Hukum/Lembaga\n• Dokumen yang menyatakan bahwa pihak yang mengajukan pengaduan berwenang untuk mewakili lembaga atau badan hukum tersebut.",
  },
  {
    q: "JENIS PELANGGARAN APA SAJA YANG BISA DILAPORKAN?",
    a: "Perbuatan yang dapat dilaporkan melalui Sistem Pelaporan Pelanggaran (Whistleblowing System) adalah sebagai berikut:\n• Benturan Kepentingan\n• Korupsi\n• Kecurangan\n• Pencurian/Penggelapan\n• Pelanggaran dalam Proses Pengadaan Barang dan Jasa\n• Penyalahgunaan jabatan/kewenangan\n• Suap/Gratifikasi",
  },
  {
    q: "KEMANA HARUS MELAPOR?",
    a: "Saluran pelaporan yang tersedia untuk melaporkan pelanggaran adalah melalui surat tertulis atau email dan ditujukan kepada:\n\nKotak Surat:\nPT. Mitra Karya Prima\nJuanda Business Centre (JBC) Blok A, No. 4, 5 dan 6.\nJl Raya Juanda No. 1 – Sidoarjo (61253)",
  },
];

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.07 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-gray-50/80 transition-colors group"
      >
        <span className="font-bold text-secondary text-sm md:text-base tracking-wide group-hover:text-primary transition-colors">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 bg-white border-t border-gray-100">
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line pt-4">
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FormState {
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  laporan: string;
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>({
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
    laporan: "",
  });
  const [fileName, setFileName] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "#e05a5a" }}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors z-10"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 md:p-10">
          {submitted ? (
            <motion.div
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle2 className="w-16 h-16 text-white mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Laporan Terkirim!
              </h3>
              <p className="text-white/80 max-w-sm">
                Terima kasih. Laporan Anda telah kami terima dan akan segera
                ditindaklanjuti oleh tim yang berwenang.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-8 py-2.5 bg-white text-[#e05a5a] font-bold rounded-lg hover:bg-white/90 transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-wide leading-snug">
                  Formulir Tanda Terima
                  <br />
                  Pelaporan Pengaduan Pelanggaran
                </h2>
              </div>

              <p className="text-white/90 text-sm mb-6 font-medium">
                Dengan ini diterangkan bahwa:
              </p>

              <div className="space-y-4">
                {/* Nama */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-white font-semibold text-sm w-36 flex-shrink-0">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 rounded-md bg-gray-100 border-0 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                    placeholder="Nama lengkap (opsional)"
                  />
                </div>

                {/* Alamat */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-white font-semibold text-sm w-36 flex-shrink-0">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 rounded-md bg-gray-100 border-0 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                    placeholder="Alamat lengkap"
                  />
                </div>

                {/* Nomor Telepon */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-white font-semibold text-sm w-36 flex-shrink-0">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="telepon"
                    value={form.telepon}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 rounded-md bg-gray-100 border-0 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                    placeholder="Nomor telepon aktif"
                  />
                </div>

                {/* Surel/Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-white font-semibold text-sm w-36 flex-shrink-0">
                    Surel/Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 rounded-md bg-gray-100 border-0 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60"
                    placeholder="alamat@email.com"
                  />
                </div>

                {/* Attachment */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-white font-semibold text-sm w-36 flex-shrink-0">
                    Attachment
                  </label>
                  <div className="flex-1">
                    <input
                      ref={fileRef}
                      type="file"
                      onChange={handleFile}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-gray-100 text-gray-700 text-sm w-full hover:bg-gray-200 transition-colors text-left"
                    >
                      <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">
                        {fileName || "Pilih file…"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Textarea */}
                <div className="pt-2">
                  <label className="text-white font-semibold text-sm block mb-2">
                    Telah menyatakan laporan pelanggaran tentang
                  </label>
                  <textarea
                    name="laporan"
                    value={form.laporan}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-md bg-gray-100 border-0 text-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 resize-none"
                    placeholder="Uraikan pelanggaran yang Anda laporkan secara jelas dan terperinci…"
                  />
                </div>
              </div>

              {/* Anonymous notice */}
              <div className="flex items-start gap-2 mt-5 bg-white/10 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 text-white/80 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-xs leading-relaxed">
                  Pelapor anonim dapat diterima, namun tidak ada kewajiban
                  Perusahaan untuk memberikan tanggapan karena keterbatasan
                  komunikasi dan klarifikasi.
                </p>
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting || !form.laporan.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-[#e05a5a] font-bold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#e05a5a] border-t-transparent rounded-full animate-spin" />
                      Mengirim…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Laporan
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function WhistleBlowing() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="bg-secondary pt-32 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #01B1D7 0%, transparent 60%), radial-gradient(circle at 80% 50%, #337AB7 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-accent/80 text-sm font-medium mb-3">
              <span>Tata Kelola</span>
              <span>/</span>
              <span className="text-white">Whistle Blowing</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Whistle Blowing System
            </h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">

          {/* Intro card */}
          <motion.div
            className="bg-secondary rounded-2xl overflow-hidden shadow-lg mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 10% 50%, #01B1D7 0%, transparent 55%)",
              }}
            />
            <div className="relative px-8 md:px-12 py-10 md:py-14 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 text-accent" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-accent uppercase font-bold tracking-widest text-xs mb-3">
                  Sistem Pelaporan Pelanggaran
                </p>
                <p className="text-white text-base md:text-lg leading-relaxed">
                  PT. Mitra Karya Prima berkomitmen menjaga integritas dan
                  tata kelola perusahaan yang baik. Gunakan sistem ini untuk
                  melaporkan segala bentuk pelanggaran secara aman dan
                  terpercaya.
                </p>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="mt-6 bg-accent hover:bg-accent/90 text-white font-bold px-7 py-2.5 rounded-full shadow-lg hover:shadow-accent/30 transition-all"
                >
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Laporkan Pelanggaran
                </Button>
              </div>
            </div>
          </motion.div>

          {/* FAQ accordion */}
          <div className="space-y-4">
            {faqs.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-gray-500 mb-4 text-sm">
              Siap untuk melaporkan pelanggaran?
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-3 rounded-full shadow-md hover:shadow-primary/30 transition-all text-base"
            >
              <Send className="w-4 h-4 mr-2" />
              Buat Laporan Sekarang
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Report Modal */}
      <AnimatePresence>
        {modalOpen && <ReportModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
