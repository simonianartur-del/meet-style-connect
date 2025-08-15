import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/hooks/useAuth";
import AuthWrapper from "@/components/AuthWrapper";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Dashboard from "./pages/Dashboard";
import Friends from "./pages/Friends";
import CreateMeetup from "./pages/CreateMeetup";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Meetups from "./pages/Meetups";
import Auth from "./pages/Auth";
import Wall from "./pages/Wall";
import Messages from "./pages/Messages";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <AuthWrapper>
                    <Header />
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/friends" element={<Friends />} />
                      <Route path="/create" element={<CreateMeetup />} />
                      <Route path="/discover" element={<Discover />} />
                      <Route path="/meetups" element={<Meetups />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/wall" element={<Wall />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/map" element={<MapView />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/:userId" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <MobileNav />
                  </AuthWrapper>
                } />
              </Routes>
            </div>
          </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
