import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Loader2 } from "lucide-react";

interface BoardMember {
  id: number;
  name: string;
  position: string | null;
  photoUrl: string;
  orderIndex: number;
}

function MemberCard({ member, index }: { member: BoardMember; index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <div className="relative w-56 h-64 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-400 mb-5">
        <img
          src={member.photoUrl}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-secondary/80 to-transparent" />
      </div>
      <h3 className="text-lg font-bold text-secondary leading-snug">{member.name}</h3>
      {member.position && (
        <p className="text-sm text-accent font-semibold mt-1">{member.position}</p>
      )}
    </motion.div>
  );
}

export default function DewanKomisaris() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/board-members?type=komisaris")
      .then((r) => r.json())
      .then((d) => setMembers(Array.isArray(d) ? d : []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="bg-secondary pt-32 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #01B1D7 0%, transparent 60%), radial-gradient(circle at 80% 50%, #337AB7 0%, transparent 60%)",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 text-accent/80 text-sm font-medium mb-3">
              <span>Profil</span><span>/</span>
              <span className="text-white">Dewan Komisaris</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">Dewan Komisaris</h1>
            <div className="mt-4 w-16 h-1 bg-accent rounded-full" />
          </motion.div>
        </div>
      </div>

      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Users size={52} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Data Dewan Komisaris belum tersedia</p>
              <p className="text-sm mt-1">Akan ditampilkan setelah diunggah oleh admin.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto">
              {members.map((m, i) => (
                <MemberCard key={m.id} member={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
