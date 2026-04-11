import GameGrid from "../components/GameGrid";

const SAVED_GAMES = [
    { id: 3, title: "Ghost of Tsushima", genres: ["Action", "Adventure"], rating: 9.2, developer: "Sucker Punch", platform: "Console", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop" }
];

export default function Collections({ searchQuery }) {
    const filteredGames = SAVED_GAMES.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.developer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-3 py-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                    My Collections
                </h1>
                <p className="text-gray-400 max-w-xl">
                    Your curated vault of saved games. Ready to jump back in?
                </p>
            </div>

            <GameGrid games={filteredGames} />
        </div>
    );
}