import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggle from "./components/ThemeToggle";

// Lazy loading das páginas para otimização de bundle
const Index = lazy(() => import("./pages/Index"));
const LoginClient = lazy(() => import("./pages/LoginClient"));
const LoginProvider = lazy(() => import("./pages/LoginProvider"));
const RegisterClient = lazy(() => import("./pages/RegisterClient"));
const RegisterProvider = lazy(() => import("./pages/RegisterProvider"));
const DashboardClient = lazy(() => import("./pages/DashboardClient"));
const DashboardProvider = lazy(() => import("./pages/DashboardProvider"));
const SearchProviders = lazy(() => import("./pages/SearchProviders"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RegisterSelect = lazy(() => import("./pages/RegisterSelect"));
const ClientProfile = lazy(() => import("./pages/ClientProfile"));
const ProviderProfile = lazy(() => import("./pages/ProviderProfile"));
const DashboardAdmin = lazy(() => import("./pages/DashboardAdmin"));
const PasswordRecovery = lazy(() => import("./pages/PasswordRecovery"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatedBackground />
        <ThemeToggle />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<RegisterSelect />} />
              <Route path="/login/client" element={<LoginClient />} />
              <Route path="/login/provider" element={<LoginProvider />} />
              <Route path="/register/client" element={<RegisterClient />} />
              <Route path="/register/provider" element={<RegisterProvider />} />
              <Route path="/dashboard/client" element={<DashboardClient />} />
              <Route path="/dashboard/provider" element={<DashboardProvider />} />
              <Route path="/search" element={<SearchProviders />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/profile/client/:id" element={<ClientProfile />} />
              <Route path="/profile/provider/:id" element={<ProviderProfile />} />
              <Route path="/dashboard/admin" element={<DashboardAdmin />} />
              <Route path="/auth/recover" element={<PasswordRecovery />} />
              <Route path="/auth/update-password" element={<UpdatePassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
