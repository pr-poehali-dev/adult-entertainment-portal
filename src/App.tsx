import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TelegramProvider } from "@/contexts/TelegramProvider";
import { ServiceCategoriesProvider } from "@/contexts/ServiceCategoriesContext";
import { PartnerProgramProvider } from "@/contexts/PartnerProgramContext";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { useState } from "react";

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
    },
  }));

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TelegramProvider>
          <LanguageProvider>
            <ServiceCategoriesProvider>
              <PartnerProgramProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/catalog" element={<Index />} />
                    <Route path="/profile" element={<Index />} />
                    <Route path="/register" element={<Index />} />
                    <Route path="/login" element={<Index />} />
                    <Route path="/search" element={<Index />} />
                    <Route path="/favorites" element={<Index />} />
                    <Route path="/messages" element={<Index />} />
                    <Route path="/rules" element={<Index />} />
                    <Route path="/service" element={<Index />} />
                    <Route path="/seller-profile" element={<Index />} />
                    <Route path="/work" element={<Index />} />
                    <Route path="/referral" element={<Index />} />
                    <Route path="/category" element={<Index />} />
                    <Route path="/invitations" element={<Index />} />
                    <Route path="/raffle" element={<Index />} />
                    <Route path="/dating" element={<Index />} />
                    <Route path="/wallet" element={<Index />} />
                    <Route path="/online-search" element={<Index />} />
                    <Route path="/parties" element={<Index />} />
                    <Route path="/party-detail" element={<Index />} />
                    <Route path="/party-chat" element={<Index />} />
                    <Route path="/organizer-dashboard" element={<Index />} />
                    <Route path="/my-ads" element={<Index />} />
                    <Route path="/user-guide" element={<Index />} />
                    <Route path="/agency-register" element={<Index />} />
                    <Route path="/agency-dashboard" element={<Index />} />
                    <Route path="/settings" element={<Index />} />
                    <Route path="/bookings" element={<Index />} />
                    <Route path="/my-orders" element={<Index />} />
                    <Route path="/order-chat" element={<Index />} />
                    <Route path="/swipe" element={<Index />} />
                    <Route path="/premium" element={<Index />} />
                    <Route path="/matches" element={<Index />} />
                    <Route path="/business-services" element={<Index />} />
                    <Route path="/all-ads" element={<Index />} />
                    <Route path="/agency-services" element={<Index />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </PartnerProgramProvider>
            </ServiceCategoriesProvider>
          </LanguageProvider>
        </TelegramProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;