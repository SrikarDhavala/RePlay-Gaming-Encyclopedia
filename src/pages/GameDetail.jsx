import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Monitor, X, ChevronLeft, ChevronRight, ExternalLink, BookmarkPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function GameDetail({ onOpenCollection }) {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const galleryScrollRef = useRef(null);

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

    //Handle Keyboard navigation for the Lightbox
    useEffect(() => {
        if (selectedIndex === null) {
            document.body.style.overflow = "unset";
            return;
        }

        document.body.style.overflow = "hidden"; // Lock background scroll

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") handleNext(e);
            if (e.key === "ArrowLeft") handlePrev(e);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [selectedIndex, game]);

    //Gallery scroll logic
    const scrollGallery = (direction) => {
        if (galleryScrollRef.current) {
            const clientWidth = galleryScrollRef.current.clientWidth;
            const scrollAmount = direction === "left" ? -(clientWidth - 100) : (clientWidth - 100);
            galleryScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    //Lightbox navigation logic
    const handleNext = (e) => {
        e.stopPropagation(); // Prevent closing the modal
        setSelectedIndex((prev) => (prev === game.screenshots.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = (e) => {
        e.stopPropagation(); // Prevent closing the modal
        setSelectedIndex((prev) => (prev === 0 ? game.screenshots.length - 1 : prev - 1));
    };

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

                        {/* Action Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">

                            <motion.a
                                href={`https://store.steampowered.com/app/${game.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white font-bold shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(139,92,246,0.3)] dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow w-full sm:w-auto"
                            >
                                View on Steam <ExternalLink size={18} />
                            </motion.a>

                            <motion.button
                                onClick={() => onOpenCollection({ id: game.id, title: game.title, image: game.image })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white font-bold transition-colors shadow-md border border-slate-300 dark:border-white/5 w-full sm:w-auto"
                            >
                                Save to Collection <BookmarkPlus size={18} />
                            </motion.button>

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

                {/*Screenshot gallery section*/}
                {game.screenshots && game.screenshots.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-20"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <ImageIcon className="text-purple-500 dark:text-purple-400" /> Gallery
                        </h3>

                        <div className="relative group/gallery">

                            {/* Gallery Left Arrow */}
                            <button
                                onClick={() => scrollGallery("left")}
                                className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 flex items-center justify-center bg-white dark:bg-[#12121a] hover:bg-gray-100 dark:hover:bg-[#1a1a24] border border-slate-200 dark:border-white/10 rounded-full text-slate-900 dark:text-white opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hidden md:flex shadow-lg hover:scale-110"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div
                                ref={galleryScrollRef}
                                className="flex gap-4 overflow-x-auto py-4 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar"
                            >
                                {game.screenshots.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedIndex(idx)} // Set the numerical index!
                                        className="relative min-w-[260px] md:min-w-[320px] h-48 snap-start shrink-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 group shadow-md"
                                    >
                                        <img
                                            src={img}
                                            alt={`${game.title} screenshot ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    </div>
                                ))}
                            </div>

                            {/* Gallery Right Arrow */}
                            <button
                                onClick={() => scrollGallery("right")}
                                className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 flex items-center justify-center bg-white dark:bg-[#12121a] hover:bg-gray-100 dark:hover:bg-[#1a1a24] border border-slate-200 dark:border-white/10 rounded-full text-slate-900 dark:text-white opacity-0 group-hover/gallery:opacity-100 transition-all duration-300 hidden md:flex shadow-lg hover:scale-110"
                            >
                                <ChevronRight size={24} />
                            </button>

                        </div>
                    </motion.div>
                )}
            </div>

            {/*Lightbox Modal for Fullscreen Image Viewing*/}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedIndex(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                            onClick={() => setSelectedIndex(null)}
                        >
                            <X size={24} />
                        </button>

                        {/* Fullscreen Left Arrow */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/50 hover:bg-white/20 p-3 rounded-full transition-colors z-50 backdrop-blur-md"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* The Image (uses key to force Framer Motion animation on swap) */}
                        <motion.img
                            key={selectedIndex}
                            initial={{ scale: 0.95, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.95, opacity: 0, x: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            src={game.screenshots[selectedIndex]}
                            alt="Fullscreen screenshot"
                            className="max-w-full max-h-full rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Fullscreen Right Arrow */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/50 hover:bg-white/20 p-3 rounded-full transition-colors z-50 backdrop-blur-md"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium tracking-widest">
                            {selectedIndex + 1} / {game.screenshots.length}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}