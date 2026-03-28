export default function Header() {
  return (
    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        {/* Added pb-2 and increased mb-3 to mb-6 */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Discover Games
        </h1>
        <p className="text-gray-400 max-w-xl">
          Your curated vault of gaming history. Dive deep into mechanics, lore, and performance stats.
        </p>
      </div>
    </div>
  );
}