import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DJProfile from "./pages/DJProfile";
import About from "./pages/About";
import ConnectWallet from "./pages/ConnectWallet";
import RegisterDJ from "./pages/RegisterDJ";
import DJDirectory from "./pages/DJDirectory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dj/featured" element={<DJDirectory />} />
          <Route path="/dj/:id" element={<DJProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/connect" element={<ConnectWallet />} />
          <Route path="/register-dj" element={<RegisterDJ />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
