import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Dashboard from "./pages/Dashboard";
import Friends from "./pages/Friends";
import CreateMeetup from "./pages/CreateMeetup";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Meetups from "./pages/Meetups";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/create" element={<CreateMeetup />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/meetups" element={<Meetups />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
