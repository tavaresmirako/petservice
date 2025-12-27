import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AnimatedBackground from "./components/AnimatedBackground";
import ThemeToggle from "./components/ThemeToggle";
import Index from "./pages/Index";
import LoginClient from "./pages/LoginClient";
import LoginProvider from "./pages/LoginProvider";
import RegisterClient from "./pages/RegisterClient";
import RegisterProvider from "./pages/RegisterProvider";
import DashboardClient from "./pages/DashboardClient";
import DashboardProvider from "./pages/DashboardProvider";
import SearchProviders from "./pages/SearchProviders";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import RegisterSelect from "./pages/RegisterSelect";
import ClientProfile from "./pages/ClientProfile";
import ProviderProfile from "./pages/ProviderProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatedBackground />
        <ThemeToggle />
        <BrowserRouter>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
