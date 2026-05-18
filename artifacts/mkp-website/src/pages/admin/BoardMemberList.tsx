import { useEffect, useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Users, Plus, Trash2, Pencil, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardMember {
  id: number;
  name: string;
  position: string | null;
  photoUrl: string;
  type: string;
  orderIndex: number;
}

function MemberGroup({ title, members, onDelete, deletingId }: {
  title: string;
  members: BoardMember[];
  onDelete: (id: number) => void;
  deletingId: number | null;
}) {
  const type = title === "Dewan Direksi" ? "direksi" : "komisaris";
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-200 rounded-full px-2.5 py-0.5 font-medium">
            {members.length}/3 anggota
          </span>
          {members.length < 3 && (
            <Link href={`/admin/board-members/baru?type=${type}`}>
              <Button size="sm" className="bg-[#0A6F85] hover:bg-[#0A6F85]/90 text-white h-8 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah
              </Button>
            </Link>
          )}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="py-12 flex flex-col items-center text-gray-400">
          <Users size={36} className="mb-2 opacity-30" />
          <p className="text-sm">Belum ada anggota</p>
          <Link href={`/admin/board-members/baru?type=${type}`}>
            <Button variant="outline" size="sm" className="mt-3 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" /> Tambah anggota
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {members.map((m) => (
            <div key={m.id} className="flex flex-col items-center text-center group relative">
              <div className="w-28 h-36 rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-3">
                <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="font-semibold text-gray-800 text-sm leading-snug">{m.name}</p>
              {m.position && <p className="text-xs text-[#0A6F85] mt-0.5">{m.position}</p>}
              <div className="flex items-center gap-1 mt-3">
                <Link href={`/admin/board-members/${m.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-[#0A6F85]">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-600"
                  onClick={() => onDelete(m.id)}
                  disabled={deletingId === m.id}
                >
                  {deletingId === m.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BoardMemberList() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/board-members", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setMembers(Array.isArray(d) ? d : []))
      .catch(() => setError("Gagal memuat data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus anggota ini?")) return;
    setDeletingId(id);
    await fetch(`/api/board-members/${id}`, { method: "DELETE", credentials: "include" });
    setDeletingId(null);
    load();
  };

  const direksi = members.filter((m) => m.type === "direksi").sort((a, b) => a.orderIndex - b.orderIndex);
  const komisaris = members.filter((m) => m.type === "komisaris").sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dewan Anggota</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola Dewan Direksi dan Dewan Komisaris PT. Mitra Karya Prima</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4" />{error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-[#01B1D7]" />
          </div>
        ) : (
          <div className="space-y-6">
            <MemberGroup title="Dewan Direksi" members={direksi} onDelete={handleDelete} deletingId={deletingId} />
            <MemberGroup title="Dewan Komisaris" members={komisaris} onDelete={handleDelete} deletingId={deletingId} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
