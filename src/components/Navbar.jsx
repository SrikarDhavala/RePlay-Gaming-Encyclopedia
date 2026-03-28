import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; // Added routing imports
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

export default function Navbar({ searchQuery, setSearchQuery }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

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
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <span className="font-bold text-white text-lg">G</span>
                    </div>
                    <span className="hidden sm:block text-xl font-bold tracking-wide">GameVault</span>
                </div>

                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search games..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden md:flex items-center gap-2 mr-2">
                        {/* Updated to pass 'to' paths instead of onClick handlers */}
                        <NavItem icon={Compass} label="Explore" to="/" />
                        <NavItem icon={Library} label="Collections" to="/collections" />
                    </div>

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
                                        <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left">
                                            <User size={16} /> My Profile
                                        </button>
                                        <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors w-full text-left">
                                            <Settings size={16} /> Settings
                                        </button>
                                        <div className="h-px bg-white/10 my-1 w-full" />
                                        <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left font-medium">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </nav>
    );
}