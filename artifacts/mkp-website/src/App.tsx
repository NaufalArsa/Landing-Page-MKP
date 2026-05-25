import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SambutanDireksi from "@/pages/SambutanDireksi";
import TentangKami from "@/pages/TentangKami";
import VisiMisi from "@/pages/VisiMisi";
import WhistleBlowing from "@/pages/WhistleBlowing";
import LaporanTahunan from "@/pages/LaporanTahunan";
import LaporanGratifikasi from "@/pages/LaporanGratifikasi";
import SuratKeputusanDireksi from "@/pages/SuratKeputusanDireksi";
import GCG from "@/pages/GCG";
import Pengadaan from "@/pages/Pengadaan";
import NewsPage from "@/pages/NewsPage";
import NewsDetail from "@/pages/NewsDetail";
import StrukturOrganisasi from "@/pages/StrukturOrganisasi";
import DewanDireksi from "@/pages/DewanDireksi";
import DewanKomisaris from "@/pages/DewanKomisaris";
import Karir from "@/pages/Karir";
import Login from "@/pages/admin/Login";
import AnnualReportList from "@/pages/admin/AnnualReportList";
import AnnualReportForm from "@/pages/admin/AnnualReportForm";
import GratificationReportList from "@/pages/admin/GratificationReportList";
import GratificationReportForm from "@/pages/admin/GratificationReportForm";
import DirectorDecreeList from "@/pages/admin/DirectorDecreeList";
import DirectorDecreeForm from "@/pages/admin/DirectorDecreeForm";
import PengadaanList from "@/pages/admin/PengadaanList";
import PengadaanForm from "@/pages/admin/PengadaanForm";
import OrgStructureAdmin from "@/pages/admin/OrgStructureAdmin";
import GcgAdmin from "@/pages/admin/GcgAdmin";
import BoardMemberList from "@/pages/admin/BoardMemberList";
import BoardMemberForm from "@/pages/admin/BoardMemberForm";
import Dashboard from "@/pages/admin/Dashboard";
import NewsList from "@/pages/admin/NewsList";
import NewsForm from "@/pages/admin/NewsForm";
import CareerList from "@/pages/admin/CareerList";
import CareerForm from "@/pages/admin/CareerForm";

const queryClient = new QueryClient();

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#01B1D7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profil/tentang-kami" component={TentangKami} />
      <Route path="/profil/sambutan-direksi" component={SambutanDireksi} />
      <Route path="/profil/visi-misi" component={VisiMisi} />
      <Route path="/tata-kelola/whistle-blowing" component={WhistleBlowing} />
      <Route path="/tata-kelola/laporan-tahunan" component={LaporanTahunan} />
      <Route path="/tata-kelola/gcg" component={GCG} />
      <Route path="/tata-kelola/laporan-gratifikasi" component={LaporanGratifikasi} />
      <Route path="/tata-kelola/surat-keputusan-direksi" component={SuratKeputusanDireksi} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:id" component={NewsDetail} />
      <Route path="/pengadaan" component={Pengadaan} />
      <Route path="/profil/struktur-organisasi" component={StrukturOrganisasi} />
      <Route path="/profil/dewan-direksi" component={DewanDireksi} />
      <Route path="/profil/dewan-komisaris" component={DewanKomisaris} />
      <Route path="/karir" component={Karir} />

      <Route path="/admin/login" component={Login} />

      <Route path="/admin">
        {() => (
          <AdminGuard>
            <Dashboard />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/berita">
        {() => (
          <AdminGuard>
            <NewsList />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/berita/baru">
        {() => (
          <AdminGuard>
            <NewsForm />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/berita/:id">
        {() => (
          <AdminGuard>
            <NewsForm />
          </AdminGuard>
        )}
      </Route>

      <Route path="/admin/laporan-tahunan">
        {() => (
          <AdminGuard>
            <AnnualReportList />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/laporan-tahunan/baru">
        {() => (
          <AdminGuard>
            <AnnualReportForm />
          </AdminGuard>
        )}
      </Route>
      <Route path="/admin/laporan-tahunan/:id">
        {() => (
          <AdminGuard>
            <AnnualReportForm />
          </AdminGuard>
        )}
      </Route>

      <Route path="/admin/laporan-gratifikasi">
        {() => <AdminGuard><GratificationReportList /></AdminGuard>}
      </Route>
      <Route path="/admin/laporan-gratifikasi/baru">
        {() => <AdminGuard><GratificationReportForm /></AdminGuard>}
      </Route>
      <Route path="/admin/laporan-gratifikasi/:id">
        {() => <AdminGuard><GratificationReportForm /></AdminGuard>}
      </Route>

      <Route path="/admin/surat-keputusan">
        {() => <AdminGuard><DirectorDecreeList /></AdminGuard>}
      </Route>
      <Route path="/admin/surat-keputusan/baru">
        {() => <AdminGuard><DirectorDecreeForm /></AdminGuard>}
      </Route>
      <Route path="/admin/surat-keputusan/:id">
        {() => <AdminGuard><DirectorDecreeForm /></AdminGuard>}
      </Route>

      <Route path="/admin/pengadaan">
        {() => <AdminGuard><PengadaanList /></AdminGuard>}
      </Route>
      <Route path="/admin/pengadaan/baru">
        {() => <AdminGuard><PengadaanForm /></AdminGuard>}
      </Route>
      <Route path="/admin/pengadaan/:id">
        {() => <AdminGuard><PengadaanForm /></AdminGuard>}
      </Route>

      <Route path="/admin/org-structure">
        {() => <AdminGuard><OrgStructureAdmin /></AdminGuard>}
      </Route>

      <Route path="/admin/gcg">
        {() => <AdminGuard><GcgAdmin /></AdminGuard>}
      </Route>

      <Route path="/admin/board-members">
        {() => <AdminGuard><BoardMemberList /></AdminGuard>}
      </Route>
      <Route path="/admin/board-members/baru">
        {() => <AdminGuard><BoardMemberForm /></AdminGuard>}
      </Route>
      <Route path="/admin/board-members/:id">
        {() => <AdminGuard><BoardMemberForm /></AdminGuard>}
      </Route>

      <Route path="/admin/karir">
        {() => <AdminGuard><CareerList /></AdminGuard>}
      </Route>
      <Route path="/admin/karir/baru">
        {() => <AdminGuard><CareerForm /></AdminGuard>}
      </Route>
      <Route path="/admin/karir/:id">
        {() => <AdminGuard><CareerForm /></AdminGuard>}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
