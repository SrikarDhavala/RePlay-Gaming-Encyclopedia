import Header from "../components/Header";
import GameRow from "../components/GameRow";
import { STEAM_CATEGORIES } from "../steamGames";

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

// 1. Removed searchQuery from props
export default function Explore({ onOpenCollection }) {
    // 2. Removed isSearching and filteredSearch logic

    return (
        <div className="animate-in fade-in duration-500">
            <Header />

            {/* 3. Removed the search conditional, just rendering the rows! */}
            <div className="mt-8 flex flex-col gap-4">
                {ROW_CONFIG.map((row) => (
                    <GameRow
                        key={row.id}
                        title={row.title}
                        games={row.data}
                        onOpenCollection={onOpenCollection}
                    />
                ))}
            </div>
        </div>
    );
}