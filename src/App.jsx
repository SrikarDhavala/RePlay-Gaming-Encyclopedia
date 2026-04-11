import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";
import Auth from "./pages/Auth";
import GameDetail from "./pages/GameDetail";
import ProfileModal from "./components/ProfileModal";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen font-sans">
        {/* Navbar stays persistent across all pages */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenProfile={() => setIsProfileModalOpen(true)} />

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
      </div>
    </Router>
  );
}