import { CheckCircle2, Award, Users, Shield, Zap, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  {
    id: "amanah",
    title: "Amanah",
    desc: "Memegang teguh kepercayaan yang diberikan",
    icon: Shield,
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    id: "kompeten",
    title: "Kompeten",
    desc: "Terus belajar dan mengembangkan kapabilitas",
    icon: Award,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200"
  },
  {
    id: "harmonis",
    title: "Harmonis",
    desc: "Saling peduli dan menghargai perbedaan",
    icon: Users,
    color: "bg-teal-50 text-teal-600 border-teal-200"
  },
  {
    id: "loyal",
    title: "Loyal",
    desc: "Berdedikasi dan mengutamakan kepentingan Bangsa dan Negara",
    icon: CheckCircle2,
    color: "bg-cyan-50 text-cyan-600 border-cyan-200"
  },
  {
    id: "adaptif",
    title: "Adaptif",
    desc: "Terus berinovasi dan antusias dalam menggerakkan perubahan",
    icon: Zap,
    color: "bg-sky-50 text-sky-600 border-sky-200"
  },
  {
    id: "kolaboratif",
    title: "Kolaboratif",
    desc: "Membangun kerja sama yang sinergis",
    icon: Handshake,
    color: "bg-blue-50 text-blue-600 border-blue-200"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
} as const;

export function Values() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-4">Core Values <span className="text-primary">AKHLAK</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Nilai-nilai inti yang menjadi pedoman budaya kerja di lingkungan PT Mitra Karya Prima.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <motion.div 
                key={val.id} 
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                variants={itemVariants}
              >
                <div className={`w-16 h-16 rounded-xl ${val.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">{val.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
