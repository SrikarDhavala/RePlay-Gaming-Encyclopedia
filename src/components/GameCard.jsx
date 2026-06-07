import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Monitor, AlertCircle, BookmarkPlus } from "lucide-react";
import { Link } from "react-router-dom";

// Added fallbackTitle as a prop
export default function GameCard({ appId, fallbackTitle, onOpenCollection }) {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true; // Prevent state updates if unmounted

        const fetchSteamData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/steam/game/${appId}`);
                const data = await response.json();

                if (response.ok && isMounted) {
                    setGame(data);
                } else if (isMounted) {
                    setError(true);
                }
            } catch (err) {
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSteamData();
        return () => { isMounted = false; };
    }, [appId]);

    if (loading) {
        return (
            <div className="h-[320px] rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse flex flex-col w-full">
                <div className="h-48 bg-white/10 w-full" />
                <div className="p-5 flex-grow space-y-3">
                    <div className="h-6 bg-white/10 rounded-md w-3/4" />
                    <div className="h-4 bg-white/10 rounded-md w-1/2" />
                </div>
            </div>
        );
    }

    // If the fetch fails, show a beautiful fallback card instead of disappearing!
    if (error || !game) {
        return (
            <div className="h-[320px] group relative flex flex-col rounded-2xl bg-[#12121a] border border-red-500/20 overflow-hidden justify-center items-center text-center p-6 w-full">
                <AlertCircle className="text-red-500/50 mb-3" size={32} />
                <h3 className="text-lg font-bold text-gray-400 mb-1">{fallbackTitle || "Unknown Game"}</h3>
                <span className="text-xs text-red-400/70 bg-red-500/10 px-2 py-1 rounded-full">Steam API Rate Limit</span>
            </div>
        );
    }

    return (
        <Link to={`/game/${game.id}`} className="block h-[320px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.01 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex flex-col h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_30px_var(--primary-glow)] cursor-pointer"
            >
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Prevents the Link from navigating to GameDetail
                            e.stopPropagation();
                            onOpenCollection({ id: game.id, title: game.title, image: game.image });
                        }}
                        className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-purple-600 backdrop-blur-md p-2 rounded-full text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                        <BookmarkPlus size={18} />
                    </button>

                    {/* Fallback to gray box if no image is returned */}
                    {game.image ? (
                        <img src={game.image} alt={game.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className="h-full w-full bg-white/5" />
                    )}
                </div>

                <div className="relative z-20 flex flex-col p-5 pt-0 flex-grow">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1 mb-2">
                        {game.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4 overflow-hidden h-[26px]">
                        {game.genres?.map((genre) => (
                            <span key={genre} className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5 whitespace-nowrap">
                                {genre}
                            </span>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center gap-3 text-gray-400 text-sm">
                        <Monitor size={16} />
                        <span className="line-clamp-1">{game.developer}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}