"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CarouselRowProps {
  title: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export function CarouselRow({ title, href, children, className }: CarouselRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true); // default true unless empty

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.75; // Scroll 75% of container width
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={cn("relative", className)}>
      <div className="flex items-end justify-between mb-4 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 tracking-tight">{title}</h2>
        {href && (
          <Link href={href} className="text-sm font-bold text-[#A6B37D] hover:text-[#8f9b6b] transition-colors">
            See all
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Left Button (Desktop Only) */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 size-12 items-center justify-center bg-white border border-neutral-200 text-neutral-600 rounded-full shadow-lg hover:bg-neutral-50 hover:text-neutral-900 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#A6B37D]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}

        {/* Scroll Container */}
        <div 
          ref={containerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide px-4 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        {/* Right Button (Desktop Only) */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 size-12 items-center justify-center bg-white border border-neutral-200 text-neutral-600 rounded-full shadow-lg hover:bg-neutral-50 hover:text-neutral-900 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#A6B37D]"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </div>
    </section>
  );
}
