import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div className="min-h-screen font-sans">
        {/* Navbar stays persistent across all pages */}
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* React Router handles switching between these components */}
          <Routes>
            <Route path="/" element={<Explore searchQuery={searchQuery} />} />
            <Route path="/collections" element={<Collections searchQuery={searchQuery} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}