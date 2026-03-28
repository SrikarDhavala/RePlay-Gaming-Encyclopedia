import GameCard from "./GameCard";

export default function GameGrid({ games }) {
    if (games.length === 0) {
        return (
            <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No games found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
                <GameCard key={game.id} game={game} />
            ))}
        </div>
    );
}