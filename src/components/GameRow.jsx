import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";

export default function GameRow({ title, games, onOpenCollection }) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const observerRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasLoaded(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const clientWidth = scrollRef.current.clientWidth;
            const scrollAmount = direction === "left" ? -(clientWidth - 150) : (clientWidth - 150);
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!games || games.length === 0) return null;

    return (
        <div ref={observerRef} className="mb-12 min-h-[380px]">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 px-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {title}
            </h2>

            {hasLoaded ? (
                // FIX #4: Changed "group" to "group/row" so it doesn't trigger the GameCards!
                <div className="relative group/row">

                    {/* FIX #1 & #2: Floating Left Arrow moved outside the grid (-left-4 to -left-8) */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 flex items-center justify-center bg-[#12121a] hover:bg-[#1a1a24] border border-white/10 rounded-full text-white opacity-0 group-hover/row:opacity-100 transition-all duration-300 hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:scale-110 hover:border-purple-500/50"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* FIX #2 & #3: Increased py-8 and px-4 to prevent zoom clipping. Added -mx-4 to keep alignment perfect. */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto py-8 px-4 -mx-4 snap-x snap-mandatory hide-scrollbar"
                    >
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)]"
                            >
                                <GameCard appId={game.id} fallbackTitle={game.title} onOpenCollection={onOpenCollection} />
                            </div>
                        ))}
                    </div>

                    {/* FIX #1 & #2: Floating Right Arrow moved outside the grid */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-30 h-12 w-12 flex items-center justify-center bg-[#12121a] hover:bg-[#1a1a24] border border-white/10 rounded-full text-white opacity-0 group-hover/row:opacity-100 transition-all duration-300 hidden md:flex shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:scale-110 hover:border-purple-500/50"
                    >
                        <ChevronRight size={24} />
                    </button>

                </div>
            ) : (
                <div className="flex gap-6 overflow-hidden py-8 px-4 -mx-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-[320px] rounded-2xl bg-white/5 border border-white/10 animate-pulse shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] xl:w-[calc(25%-18px)]"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}