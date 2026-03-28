import Header from "../components/Header";
import GameGrid from "../components/GameGrid";
import GameRow from "../components/GameRow";

// Expanded Mock Data structured by categories
const CATEGORIES = {
    trending: [
        { id: 1, title: "Helldivers 2", genres: ["Shooter", "Multiplayer"], rating: 9.0, developer: "Arrowhead", platform: "PC/PS5", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" },
        { id: 2, title: "Palworld", genres: ["Survival", "Open World"], rating: 8.5, developer: "Pocketpair", platform: "PC/Xbox", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" },
        { id: 3, title: "Cyberpunk 2077", genres: ["RPG", "Sci-Fi"], rating: 8.8, developer: "CD Projekt Red", platform: "PC", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop" },
        { id: 4, title: "Baldur's Gate 3", genres: ["RPG", "Story"], rating: 9.7, developer: "Larian Studios", platform: "PC/Console", image: "https://images.unsplash.com/photo-1604028297199-a4644bba8826?q=80&w=800&auto=format&fit=crop" }
    ],
    upcoming: [
        { id: 5, title: "GTA VI", genres: ["Action", "Open World"], rating: "TBD", developer: "Rockstar", platform: "Console", image: "https://images.unsplash.com/photo-1605901302636-2244243df03c?q=80&w=800&auto=format&fit=crop" },
        { id: 6, title: "Hollow Knight: Silksong", genres: ["Metroidvania", "Indie"], rating: "TBD", developer: "Team Cherry", platform: "PC/Console", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop" }
    ],
    cultClassics: [
        { id: 7, title: "Bloodborne", genres: ["Action RPG", "Souls-like"], rating: 9.6, developer: "FromSoftware", platform: "PS4", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" },
        { id: 8, title: "Fallout: New Vegas", genres: ["RPG", "Story"], rating: 9.4, developer: "Obsidian", platform: "PC/Console", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" }
    ]
};

// Flatten all games into one array for the search function
const ALL_GAMES = Object.values(CATEGORIES).flat();

export default function Explore({ searchQuery }) {
    // If the user is searching, filter the flattened array
    const filteredGames = ALL_GAMES.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Determine if we are in "Search Mode" or "Browse Mode"
    const isSearching = searchQuery.trim().length > 0;

    return (
        <div className="animate-in fade-in duration-500">
            <Header />

            {isSearching ? (
                // --- SEARCH MODE ---
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-6 text-gray-400">
                        Search results for <span className="text-white">"{searchQuery}"</span>
                    </h2>
                    <GameGrid games={filteredGames} />
                </div>
            ) : (
                // --- BROWSE MODE ---
                <div className="mt-8 flex flex-col gap-4">
                    <GameRow title="🔥 Trending Now" games={CATEGORIES.trending} />
                    <GameRow title="📅 Upcoming Releases" games={CATEGORIES.upcoming} />
                    <GameRow title="💎 Cult Classics" games={CATEGORIES.cultClassics} />
                </div>
            )}
        </div>
    );
}