import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Bookmark, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CollectionModal({ isOpen, onClose, selectedGame }) {
    const [collections, setCollections] = useState([]);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("gamevault_user"));

    // Fetch collections when modal opens
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

    useEffect(() => {
        if (isOpen) {
            if (!user) {
                alert("Please log in to save games!");
                onClose();
                navigate("/auth");
                return;
            }
            fetchCollections();
        }
    }, [isOpen]);

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/collections/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, name: newCollectionName })
            });
            if (res.ok) {
                setNewCollectionName("");
                fetchCollections(); // Refresh list
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleToggleGame = async (collectionName) => {
        try {
            await fetch("http://localhost:5000/api/collections/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    collection_name: collectionName,
                    game: {
                        id: selectedGame.id,
                        title: selectedGame.title,
                        image: selectedGame.image || ""
                    }
                })
            });
            fetchCollections(); // Refresh to show checkmark
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen || !selectedGame) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white dark:bg-[#0a0a0f] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

                    <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Bookmark className="text-purple-500" size={20} /> Save to Collection
                        </h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
                    </div>

                    {/* Game Preview */}
                    <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-4">
                        {selectedGame.image ? (
                            <img src={selectedGame.image} alt="Cover" className="w-16 h-10 object-cover rounded-md shadow-md" />
                        ) : (
                            <div className="w-16 h-10 bg-slate-200 dark:bg-white/10 rounded-md" />
                        )}
                        <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{selectedGame.title}</p>
                    </div>

                    {/* Collections List */}
                    <div className="p-4 overflow-y-auto flex-1 space-y-2">
                        {collections.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No collections yet.</p>
                        ) : (
                            collections.map((col) => {
                                const hasGame = col.games.some(g => g.id === selectedGame.id);
                                return (
                                    <button
                                        key={col.name}
                                        onClick={() => handleToggleGame(col.name)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors text-left"
                                    >
                                        <span className="text-sm font-medium text-slate-700 dark:text-gray-200">{col.name}</span>
                                        {hasGame ? <Check size={18} className="text-green-500" /> : <Plus size={18} className="text-slate-400" />}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Create New Collection */}
                    <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10">
                        <form onSubmit={handleCreateCollection} className="flex gap-2">
                            <input
                                type="text" placeholder="New collection name..."
                                value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)}
                                className="flex-1 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                            />
                            <button disabled={loading} type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-colors shadow-md">
                                <Plus size={20} />
                            </button>
                        </form>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}