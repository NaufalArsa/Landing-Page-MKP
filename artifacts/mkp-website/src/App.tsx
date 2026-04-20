import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SambutanDireksi from "@/pages/SambutanDireksi";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import NewsList from "@/pages/admin/NewsList";
import NewsForm from "@/pages/admin/NewsForm";

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
      <Route path="/profil/sambutan-direksi" component={SambutanDireksi} />

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
