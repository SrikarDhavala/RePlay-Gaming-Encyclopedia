import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // NEW: imported useLocation
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";
import Auth from "./pages/Auth";
import GameDetail from "./pages/GameDetail";
import ProfileModal from "./components/ProfileModal";
import SettingsModal from "./components/SettingsModal";
import CollectionModal from "./components/CollectionModal";

// NEW: We moved all your state and logic into an internal "AppContent" component
function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [selectedGameForCollection, setSelectedGameForCollection] = useState(null);

  // NEW: Grab the current URL path
  const location = useLocation();

  const openCollectionModal = (gameData) => {
    setSelectedGameForCollection(gameData);
    setIsCollectionModalOpen(true);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen font-sans text-slate-900 dark:text-white transition-colors duration-300">

      {/* NEW: Conditional Rendering. Only show Navbar if the path is NOT '/auth' */}
      {location.pathname !== "/auth" && (
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />
      )}

      {/* NEW: Remove top padding on the Auth page so it centers perfectly */}
      <main className={`max-w-7xl mx-auto px-6 ${location.pathname === "/auth" ? "py-0" : "py-12"}`}>
        <Routes>
          {/* Removed searchQuery prop from Explore and Collections */}
          <Route path="/" element={<Explore onOpenCollection={openCollectionModal} />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/game/:id" element={<GameDetail onOpenCollection={openCollectionModal} />} />
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

      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        selectedGame={selectedGameForCollection}
      />
    </div>
  );
}

// Your main App default export now just wraps everything in the Router!
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}