import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const GENRES = [
    "Action", "RPG", "Shooter", "Strategy", "Sports",
    "Racing", "Fighting", "Puzzle", "Platformer", "Survival",
    "Horror", "MMO", "Sandbox", "Stealth", "Simulation"
];

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    // States for all fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);

    const navigate = useNavigate();

    const toggleGenre = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else if (selectedGenres.length < 5) {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "login" : "signup";

        // Dynamically build the payload
        const payload = isLogin
            ? { email, password }
            : { email, password, name, username, phone, genres: selectedGenres };

        try {
            const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the user data to localStorage so the rest of the app can use it
                localStorage.setItem("gamevault_user", JSON.stringify(data.user));
                alert(data.message);
                navigate("/"); // Send them to the homepage
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert("Failed to connect to server.");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center animate-in fade-in duration-500 py-12">
            <motion.div
                layout
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_40px_rgba(139,92,246,0.1)]"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 pb-1">
                    {isLogin ? "Welcome Back" : "Join GameVault"}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* New Fields only show up during Sign Up */}
                    <AnimatePresence>
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col gap-4 overflow-hidden"
                            >
                                <input
                                    type="text" placeholder="Full Name" required={!isLogin}
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text" placeholder="Username" required={!isLogin}
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                    <input
                                        type="tel" placeholder="Phone Number" required={!isLogin}
                                        value={phone} onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Standard Fields */}
                    <input
                        type="email" placeholder="Email Address" required
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 mt-1"
                    />
                    <input
                        type="password" placeholder="Password" required
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50"
                    />

                    {/* Genre Selection for Signup */}
                    {!isLogin && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                            <p className="text-sm text-gray-400 mb-3">Select top genres (Max 5): {selectedGenres.length}/5</p>
                            <div className="flex flex-wrap gap-2">
                                {GENRES.map(genre => {
                                    const isSelected = selectedGenres.includes(genre);
                                    return (
                                        <button
                                            key={genre} type="button" onClick={() => toggleGenre(genre)}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${isSelected ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {genre}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    <button type="submit" className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                        {isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    {isLogin ? "New to GameVault? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-purple-400 hover:text-purple-300 font-semibold">
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}