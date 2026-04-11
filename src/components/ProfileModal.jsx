import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Save, User as UserIcon } from "lucide-react";

const ALL_GENRES = [
    "Action", "RPG", "Shooter", "Strategy", "Sports",
    "Racing", "Fighting", "Puzzle", "Platformer", "Survival",
    "Horror", "MMO", "Sandbox", "Stealth", "Simulation"
];

export default function ProfileModal({ isOpen, onClose }) {
    const [isEditing, setIsEditing] = useState(false);

    // Mock user data (In a real app, fetch this from Flask/MongoDB on load)
    const [userData, setUserData] = useState({
        name: "", username: "", phone: "", genres: []
    });

    // Temporary state for edits before saving
    const [editData, setEditData] = useState({ ...userData });

    // Reset edit data when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            const storedUser = localStorage.getItem("gamevault_user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserData(parsedUser);
                setEditData(parsedUser);
            }
            setIsEditing(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        setUserData({ ...editData });
        setIsEditing(false);
        // Here you would also send a PUT/PATCH request to your Python backend to update MongoDB
    };

    const toggleGenre = (genre) => {
        if (!isEditing) return;

        if (editData.genres.includes(genre)) {
            setEditData({ ...editData, genres: editData.genres.filter(g => g !== genre) });
        } else if (editData.genres.length < 5) {
            setEditData({ ...editData, genres: [...editData.genres, genre] });
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Blurred Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <UserIcon className="text-purple-400" /> My Profile
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* Input Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white disabled:opacity-70 disabled:text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Username</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={editData.username}
                                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white disabled:opacity-70 disabled:text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="tel"
                                        disabled={!isEditing}
                                        value={editData.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-white disabled:opacity-70 disabled:text-gray-300 focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Genres */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Favorite Genres (Max 5)</label>
                                {isEditing && <span className="text-xs text-purple-400">{editData.genres.length}/5</span>}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(isEditing ? ALL_GENRES : userData.genres).map(genre => {
                                    const isSelected = editData.genres.includes(genre);
                                    return (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => toggleGenre(genre)}
                                            disabled={!isEditing}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${isSelected
                                                ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                                                : "bg-white/5 border-white/10 text-gray-500 disabled:opacity-50"
                                                } ${!isEditing && !isSelected ? "hidden" : ""}`}
                                        // Hides unselected genres when not in edit mode for a cleaner look
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Footer / Actions */}
                    <div className="p-6 pt-0 flex justify-end gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => { setIsEditing(false); setEditData({ ...userData }); }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                >
                                    <Save size={16} /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                            >
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        )}
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}