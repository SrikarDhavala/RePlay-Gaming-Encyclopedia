import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Bell, Shield, Monitor } from "lucide-react";

export default function SettingsModal({ isOpen, onClose, isDarkMode, setIsDarkMode }) {
    const [activeTab, setActiveTab] = useState("appearance");

    // Future-proofing the menu with mock tabs
    const tabs = [
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy & Safety", icon: Shield },
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

                {/* Blurred Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl h-[80vh] min-h-[500px] bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden flex flex-col md:flex-row"
                >

                    {/* Left Column: Sidebar Navigation */}
                    <div className="w-full md:w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col shrink-0">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">
                            User Settings
                        </h2>
                        <nav className="flex flex-col gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? "bg-purple-500/20 text-purple-300"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-purple-400" : "text-gray-500"} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Column: Settings Content */}
                    <div className="flex-1 p-8 relative overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors border border-white/10"
                        >
                            <X size={20} />
                        </button>

                        {/* Appearance Tab Content */}
                        {activeTab === "appearance" && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="max-w-xl"
                            >
                                <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                    Appearance
                                </h3>

                                <div className="space-y-6">
                                    {/* Theme Toggle Section */}
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between">
                                        <div>
                                            <h4 className="text-white font-medium flex items-center gap-2">
                                                <Monitor size={18} className="text-purple-400" /> Theme Preference
                                            </h4>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Switch between Light and Dark mode.
                                            </p>
                                        </div>

                                        {/* Custom Animated Toggle Switch */}
                                        <button
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${isDarkMode ? "bg-purple-600" : "bg-gray-600"
                                                }`}
                                        >
                                            <motion.div
                                                layout
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                                style={{
                                                    // Flips the knob from left to right
                                                    marginLeft: isDarkMode ? "auto" : "0",
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>

                            </motion.div>
                        )}

                        {/* Placeholders for other tabs */}
                        {activeTab === "notifications" && (
                            <div className="text-gray-400">Notification settings coming soon...</div>
                        )}
                        {activeTab === "privacy" && (
                            <div className="text-gray-400">Privacy settings coming soon...</div>
                        )}

                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}