import Header from "../components/Header";
import GameGrid from "../components/GameGrid";
import GameRow from "../components/GameRow";
import { STEAM_CATEGORIES } from "../steamGames";

const ALL_GAMES = Object.values(STEAM_CATEGORIES).flat();

const ROW_CONFIG = [
    { id: 'heavy', title: "🔥 The Heavy Hitters", data: STEAM_CATEGORIES.heavyHitters },
    { id: 'new', title: "🚀 Trending & New", data: STEAM_CATEGORIES.newAndTrending },
    { id: 'rpg', title: "🌍 Open World & RPGs", data: STEAM_CATEGORIES.openWorldRpg },
    { id: 'indie', title: "💎 Indie Gems", data: STEAM_CATEGORIES.indieGems },
    { id: 'multi', title: "⚔️ Multiplayer & Survival", data: STEAM_CATEGORIES.multiplayerSurvival },
    { id: 'arkham', title: "🦇 The Arkham Series", data: STEAM_CATEGORIES.arkhamSeries },
    { id: 'sim', title: "🏗️ Sim & Strategy", data: STEAM_CATEGORIES.simAndStrategy },
    { id: 'valve', title: "⚙️ Valve Classics", data: STEAM_CATEGORIES.valveClassics }
];

export default function Explore({ searchQuery }) {
    const isSearching = searchQuery.trim().length > 0;

    const filteredSearch = ALL_GAMES.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            <Header />

            {isSearching ? (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-400">
                        Search results for <span className="text-white">"{searchQuery}"</span>
                    </h2>
                    {/* Note: Ensure your GameGrid also passes fallbackTitle if you updated it! */}
                    <GameGrid games={filteredSearch} />
                </div>
            ) : (
                <div className="mt-8 flex flex-col gap-4">
                    {ROW_CONFIG.map((row) => (
                        <GameRow key={row.id} title={row.title} games={row.data} />
                    ))}
                </div>
            )}
        </div>
    );
}