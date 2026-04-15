import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, checkSession } from "@/lib/auth";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const isDev = import.meta.env.DEV || window.location.hostname.includes("lovable.app");

function AuthGate() {
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const setUser = useAuth((s) => s.setUser);
  const setLoading = useAuth((s) => s.setLoading);

  useEffect(() => {
    if (isDev) {
      setUser("demo");
      setLoading(false);
      return;
    }
    checkSession().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={user ? <Index /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthGate />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
