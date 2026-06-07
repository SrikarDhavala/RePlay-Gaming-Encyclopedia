import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Save, User as UserIcon, Check } from "lucide-react";

const ALL_GENRES = [
    "Action", "RPG", "Shooter", "Strategy", "Sports",
    "Racing", "Fighting", "Puzzle", "Platformer", "Survival",
    "Horror", "MMO", "Sandbox", "Stealth", "Simulation"
];

export default function ProfileModal({ isOpen, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({ name: "", username: "", phone: "", genres: [] });

    // Get the current user from localStorage
    const user = JSON.parse(localStorage.getItem("gamevault_user"));

    // Every time the modal opens, populate the inputs with the latest local storage data
    useEffect(() => {
        if (isOpen && user) {
            setEditData({
                name: user.name || "",
                username: user.username || "",
                phone: user.phone || "",
                genres: user.genres || [] // Load genres from storage
            });
            setIsEditing(false); // Always start in view-only mode
        }
    }, [isOpen]);

    // NEW: Function to handle clicking the genre bubbles
    const toggleGenre = (genre) => {
        if (editData.genres.includes(genre)) {
            setEditData({ ...editData, genres: editData.genres.filter(g => g !== genre) });
        } else if (editData.genres.length < 5) {
            setEditData({ ...editData, genres: [...editData.genres, genre] });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Send the new data to the database
            const res = await fetch("http://localhost:5000/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    name: editData.name,
                    username: editData.username,
                    phone: editData.phone,
                    genres: editData.genres // Send genres to the backend!
                })
            });

            if (res.ok) {
                // 2. Update the localStorage session so the app remembers it
                const updatedUser = { ...user, ...editData };
                localStorage.setItem("gamevault_user", JSON.stringify(updatedUser));

                // 3. Turn off edit mode
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !user) return null;

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
                                {(isEditing ? ALL_GENRES : (user?.genres || [])).map(genre => {
                                    const isSelected = editData.genres?.includes(genre);
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
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 hover:shadow-lg transition-all disabled:opacity-70"
                                >
                                    {isSaving ? "Saving..." : <><Check size={16} /> Save Changes</>}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-colors"
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