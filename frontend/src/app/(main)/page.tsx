export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center py-16 px-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
          Discover your next favorite book with <span className="text-[#A6B37D]">AI</span>.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search for millions of books, track your reading list, and get personalized recommendations from your AI companions.
        </p>
      </div>

      <div className="mt-16 w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Books (Coming Soon)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Placeholder cards */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2 group cursor-pointer">
              <div className="aspect-[2/3] w-full bg-gray-200 rounded-md overflow-hidden relative">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#A6B37D] transition-colors">Book Title {i}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">Author Name</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
