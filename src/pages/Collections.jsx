import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Library } from "lucide-react";

export default function Collections() {
    const [collections, setCollections] = useState([]);
    const user = JSON.parse(localStorage.getItem("gamevault_user"));

    useEffect(() => {
        const fetchCollections = async () => {
            if (!user) return;
            try {
                const res = await fetch(`http://localhost:5000/api/collections/${user.email}`);
                const data = await res.json();
                setCollections(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCollections();
    }, []);

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <Library size={64} className="text-slate-300 dark:text-gray-700 mb-6" />
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your Personal Vault</h2>
                <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md">Log in to create custom collections, track what you're playing, and build your ultimate gaming library.</p>
                <Link to="/auth" className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-lg">Sign In / Sign Up</Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-500 pb-2">
                    My Collections
                </h1>
                <p className="text-slate-600 dark:text-gray-400">Curate and organize your gaming library.</p>
            </div>

            {collections.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed">
                    <p className="text-lg text-slate-500 dark:text-gray-400">You haven't created any collections yet.</p>
                    <p className="text-sm text-slate-400 dark:text-gray-500 mt-2">Click the bookmark icon on any game card to get started!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-12">
                    {collections.map((col) => (
                        <div key={col.name}>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-white/10 pb-2 flex justify-between items-end">
                                {col.name} <span className="text-sm font-medium text-slate-500 dark:text-gray-500">{col.games.length} Games</span>
                            </h3>

                            {col.games.length === 0 ? (
                                <p className="text-slate-400 italic">No games in this collection.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {col.games.map((game) => (
                                        <Link key={game.id} to={`/game/${game.id}`} className="group relative rounded-xl overflow-hidden shadow-md aspect-[3/4] border border-slate-200 dark:border-white/10">
                                            <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                <p className="text-white font-bold text-sm line-clamp-2 leading-tight">{game.title}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}