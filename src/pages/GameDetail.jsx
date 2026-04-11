import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/steam/game/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setGame(data);
                }
            } catch (error) {
                console.error("Failed to fetch game details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
        // Scroll to top when page loads
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!game) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
                <h2 className="text-2xl font-bold text-white mb-4">Game Not Found</h2>
                <Link to="/" className="text-purple-400 hover:text-purple-300">Return to Vault</Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen -mt-16 pb-20">
            {/* Hero Background */}
            <div className="absolute inset-0 h-[60vh] w-full z-0">
                <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--gaming-bg)] via-[var(--gaming-bg)]/80 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Vault
                </Link>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col lg:flex-row gap-12">

                    {/* Main Lore Column */}
                    <div className="flex-1">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl pb-2">
                            {game.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                            <span className="text-gray-300 font-semibold">{game.developer}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-300">{game.platform}</span>
                        </div>

                        {/* Steam sends description as HTML. We render it here. */}
                        <div
                            className="text-lg text-gray-300 leading-relaxed mb-8 prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: game.description }}
                        />

                        <div className="flex flex-wrap gap-2">
                            {game.genres.map((genre) => (
                                <span key={genre} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* System Reqs Sidebar */}
                    <div className="w-full lg:w-[400px] bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md h-fit shrink-0">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Monitor className="text-purple-400" /> PC Requirements
                        </h3>

                        {/* Steam's system requirements are also returned as formatted HTML lists */}
                        <div
                            className="text-sm text-gray-400 space-y-2 prose prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
                            dangerouslySetInnerHTML={{ __html: game.sysReq }}
                        />
                    </div>

                </motion.div>
            </div>
        </div>
    );
}