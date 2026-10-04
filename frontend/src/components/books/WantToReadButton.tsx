"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlus, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface WantToReadButtonProps {
  itemId: string;
  itemType: "book" | "manga";
  className?: string;
  variant?: "icon" | "solid";
}

export function WantToReadButton({ itemId, itemType, className, variant = "icon" }: WantToReadButtonProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  
  // TODO: Replace with real auth check
  const isLoggedIn = false; 

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the item page if it's inside a Link
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Toggle saved state
    setIsSaved(!isSaved);
    // TODO: Call API to save/remove from want_to_read
    console.log(`Toggle want to read for ${itemType} with ID ${itemId}`);
  };

  if (variant === "solid") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg font-bold transition-colors shadow-sm",
          isSaved 
            ? "bg-[#8f9b6b] text-white hover:bg-[#8f9b6b]/90" 
            : "bg-[#A6B37D] text-white hover:bg-[#8f9b6b]",
          className
        )}
      >
        {isSaved ? (
          <>
            <BookmarkCheck className="size-5" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <BookmarkPlus className="size-5" />
            <span>Want to Read</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      title={isSaved ? "Remove from Want to Read" : "Want to Read"}
      className={cn(
        "absolute top-2 right-2 p-2 rounded-full shadow-sm bg-white/90 backdrop-blur-sm border border-neutral-200 transition-all z-20",
        "hover:bg-[#A6B37D] hover:text-white hover:border-[#A6B37D]",
        "opacity-100 lg:opacity-0 group-hover:opacity-100", // Always visible on mobile & tablet, visible on hover on desktop
        isSaved ? "bg-[#A6B37D] text-white border-[#A6B37D] lg:opacity-100" : "text-neutral-500",
        className
      )}
    >
      {isSaved ? (
        <BookmarkCheck className="size-4" />
      ) : (
        <BookmarkPlus className="size-4" />
      )}
    </button>
  );
}
