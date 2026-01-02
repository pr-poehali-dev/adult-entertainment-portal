import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TelegramProvider } from "@/contexts/TelegramProvider";
import { BusinessServicesProvider } from "@/contexts/BusinessServicesContext";
import { CatalogProvider } from "@/contexts/CatalogContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TelegramProvider>
      <LanguageProvider>
        <AuthProvider>
          <BusinessServicesProvider>
            <CatalogProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CatalogProvider>
          </BusinessServicesProvider>
        </AuthProvider>
      </LanguageProvider>
    </TelegramProvider>
  </QueryClientProvider>
);

export default App;