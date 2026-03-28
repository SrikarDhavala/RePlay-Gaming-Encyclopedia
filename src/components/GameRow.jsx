import GameCard from "./GameCard";

export default function GameRow({ title, games }) {
    if (!games || games.length === 0) return null;

    return (
        <div className="mb-12">
            {/* Added pb-2 here to prevent bg-clip-text from cutting off letters like 'g' and 'p' */}
            <h2 className="text-2xl md:text-3xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {title}
            </h2>

            {/* Horizontal scroll container */}
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                {games.map((game) => (
                    // min-w forces the cards to stay a specific size instead of squishing
                    <div key={game.id} className="min-w-[280px] sm:min-w-[300px] snap-start">
                        <GameCard game={game} />
                    </div>
                ))}
            </div>
        </div>
    );
}