"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  bookId: string;
  className?: string;
}

export function WishlistButton({ bookId, className }: WishlistButtonProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // TODO: Replace with real auth check
  const isLoggedIn = false; 

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the book page if it's inside a Link
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Toggle saved state
    setIsSaved(!isSaved);
    // TODO: Call API to save/remove from wishlist
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "absolute top-2 right-2 p-2 rounded-full shadow-sm bg-white/90 backdrop-blur-sm border border-neutral-200 transition-all z-20",
        "hover:bg-[#A6B37D] hover:text-white hover:border-[#A6B37D]",
        "opacity-100 lg:opacity-0 group-hover:opacity-100", // Always visible on mobile & tablet, visible on hover on desktop
        isSaved ? "bg-[#A6B37D] text-white border-[#A6B37D] lg:opacity-100" : "text-neutral-500",
        className
      )}
    >
      <Bookmark 
        className={cn(
          "size-4 transition-all", 
          isSaved || isHovered ? "fill-current" : ""
        )} 
      />
    </button>
  );
}
