
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import ChatbotSheet from "./components/ChatbotSheet";
import Index from "./pages/Index";
import Nutrition from "./pages/Nutrition";
import Workouts from "./pages/Workouts";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen pb-16 md:pb-0 pt-16">
            <Navbar />
            <main className="py-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <MobileNav />
            <ChatbotSheet />
          </div>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
