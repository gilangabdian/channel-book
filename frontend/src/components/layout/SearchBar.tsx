"use client";

import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="size-4 text-gray-400 group-focus-within:text-[#A6B37D] transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Search books or ask AI..."
        className="w-full bg-gray-50 border border-gray-200 text-sm rounded-full pl-10 pr-10 py-2 outline-none focus:bg-white focus:border-[#A6B37D] focus:ring-2 focus:ring-[#A6B37D]/20 transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-400 hover:text-[#A6B37D] transition-colors"
        title="AI Search Assist">
        <Sparkles className="size-4" />
      </button>
    </form>
  );
}
