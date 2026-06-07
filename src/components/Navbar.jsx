import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added routing imports
import { Compass, Library, Search, User, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavItem = ({ icon: Icon, label, to }) => {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    // Check if the current URL matches the 'to' prop
    const isActive = location.pathname === to;
    const showLabel = isActive || isHovered;

    return (
        <Link
            to={to}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center justify-center h-10 px-3 rounded-full border transition-all duration-300 ${isActive
                ? "bg-white/10 border-purple-500/50 text-white shadow-[0_0_15px_var(--primary-glow)]"
                : "bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10"
                }`}
        >
            <Icon size={18} className={isActive ? "text-purple-400 transition-colors" : ""} />
            <motion.div
                initial={false}
                animate={{
                    width: showLabel ? "auto" : 0,
                    opacity: showLabel ? 1 : 0,
                    marginLeft: showLabel ? 8 : 0
                }}
                className="overflow-hidden whitespace-nowrap text-sm font-medium flex items-center"
            >
                {label}
            </motion.div>
        </Link>
    );
};

const SearchOverlay = ({ searchQuery, onClose }) => {
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) return;

        // Debounce: Wait 500ms after user stops typing before fetching
        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`http://localhost:5000/api/steam/search/${searchQuery}`);
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white/90 dark:bg-[#0a0a0f]/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl dark:shadow-[0_10px_40px_rgba(139,92,246,0.15)] overflow-hidden z-50 flex flex-col max-h-[400px]"
        >
            <div className="p-2 overflow-y-auto hide-scrollbar">
                {isSearching ? (
                    <div className="p-4 text-center text-sm text-slate-500 dark:text-gray-400 animate-pulse">
                        Searching the vault...
                    </div>
                ) : results.length > 0 ? (
                    results.map((game) => (
                        <Link
                            key={game.id}
                            to={`/game/${game.id}`}
                            onClick={onClose}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group"
                        >
                            <img
                                src={game.image}
                                alt={game.title}
                                className="w-16 h-10 object-cover rounded-md shadow-sm border border-slate-200 dark:border-white/5 group-hover:border-purple-500/50 transition-colors"
                            />
                            <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
                                {game.title}
                            </span>
                        </Link>
                    ))
                ) : (
                    <div className="p-4 text-center text-sm text-slate-500 dark:text-gray-400">
                        No games found. Try a different title!
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default function Navbar({ searchQuery, setSearchQuery, onOpenProfile, onOpenSettings }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();

    const user = localStorage.getItem("gamevault_user");

    const handleLogout = () => {
        localStorage.removeItem("gamevault_user"); // Clears the session
        setIsProfileOpen(false); // Closes the menu
        navigate("/"); // Sends user back to the homepage
        window.location.reload(); // Refreshes the app to clear out any active profile states
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-[#0a0a0f]/80 border-slate-200 dark:border-white/10 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="font-bold text-white text-lg">RP</span>
                    </div>
                    <span className="hidden sm:block text-xl font-bold tracking-wide">RePlay</span>
                </div>

                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors z-10" size={18} />

                    <input
                        type="text"
                        placeholder="Search Steam database..."
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all relative z-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* NEW: Blurred Search Overlay Modal */}
                    <AnimatePresence>
                        {searchQuery.trim().length > 0 && (
                            <>
                                {/* Full screen invisible backdrop to close search when clicking away */}
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 w-screen h-screen z-0"
                                    onClick={() => setSearchQuery("")}
                                />

                                {/* The actual blurred dropdown */}
                                <SearchOverlay searchQuery={searchQuery} onClose={() => setSearchQuery("")} />
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden md:flex items-center gap-2 mr-2">
                        {/* Updated to pass 'to' paths instead of onClick handlers */}
                        <NavItem icon={Compass} label="Explore" to="/" />
                        <NavItem icon={Library} label="Collections" to="/collections" />
                    </div>

                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isProfileOpen ? "bg-white/20 border-purple-500/50 shadow-[0_0_15px_var(--primary-glow)]" : "bg-white/10 hover:bg-white/20 border-white/10"
                                    } border`}
                            >
                                <User size={18} className={isProfileOpen ? "text-purple-400" : "text-gray-300"} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="absolute right-0 top-full mt-3 w-48 bg-[#12121a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden origin-top-right"
                                    >
                                        <div className="flex flex-col py-2">
                                            <button
                                                onClick={() => {
                                                    onOpenProfile(); // Trigger the modal
                                                    setIsProfileOpen(false); // Close the dropdown menu
                                                }}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                                            >
                                                <User size={16} /> My Profile
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onOpenSettings(); // Trigger the Settings Modal
                                                    setIsProfileOpen(false); // Close the dropdown menu
                                                }}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                                            >
                                                <Settings size={16} /> Settings
                                            </button>
                                            <div className="h-px bg-white/10 my-1 w-full" />
                                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left font-medium">
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link
                            to="/auth"
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                        >
                            Sign In
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
}