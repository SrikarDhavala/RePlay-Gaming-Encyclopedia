import { motion } from "framer-motion";
import { Star, Monitor, Gamepad2 } from "lucide-react";

export default function GameCard({ game }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative flex flex-col rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md transition-all duration-30 hover:border-purple-500/50 hover:shadow-[0_0_30px_var(--primary-glow)] cursor-pointer"
        >
            {/* Cover Image */}
            <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
                <img
                    src={game.image}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-sm font-semibold text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    {game.rating}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col p-5 pt-2 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {game.title}
                    </h3>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {game.genres.map((genre) => (
                        <span key={genre} className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300 border border-white/5">
                            {genre}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex items-center gap-3 text-gray-400 text-sm">
                    {game.platform === 'PC' ? <Monitor size={16} /> : <Gamepad2 size={16} />}
                    <span>{game.developer}</span>
                </div>
            </div>
        </motion.div>
    );
}