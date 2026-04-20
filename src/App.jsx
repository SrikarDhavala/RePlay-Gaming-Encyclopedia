import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";
import Auth from "./pages/Auth";
import GameDetail from "./pages/GameDetail";
import ProfileModal from "./components/ProfileModal";
import SettingsModal from "./components/SettingsModal";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen font-sans text-slate-900 dark:text-white transition-colors duration-300">
        {/* Navbar stays persistent across all pages */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenProfile={() => setIsProfileModalOpen(true)} onOpenSettings={() => setIsSettingsModalOpen(true)} />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* React Router handles switching between these components */}
          <Routes>
            <Route path="/" element={<Explore searchQuery={searchQuery} />} />
            <Route path="/collections" element={<Collections searchQuery={searchQuery} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/game/:id" element={<GameDetail />} />
          </Routes>
        </main>

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>
    </Router>
  );
}