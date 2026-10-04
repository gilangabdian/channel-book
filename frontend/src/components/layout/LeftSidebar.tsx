"use client";

import { Plus, Library, PanelLeftClose, Search } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  isLoggedIn: boolean;
}

export function LeftSidebar({ isLoggedIn }: LeftSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const router = useRouter();

  useEffect(() => {
    if (searchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (showAuthPopup && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.top,
        left: rect.right + 16,
      });
    }
  }, [showAuthPopup, isExpanded]);

  // Click outside to close custom popup
  useEffect(() => {
    if (!showAuthPopup) return;
    const handleClickOutside = (e: MouseEvent) => {
      // Very basic click outside detection
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-auth-popup") && !target.closest(".auth-popup-trigger")) {
        setShowAuthPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAuthPopup]);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-neutral-200 shrink-0 relative",
        isExpanded ? "w-[280px]" : "w-[60px]",
      )}>
      {/* Header / Collapse Toggle */}
      <div
        className={cn(
          "flex items-center h-14 border-b border-transparent shrink-0 px-3",
          isExpanded ? "justify-between" : "justify-center",
        )}>
        {isExpanded && (
          <div className="flex items-center gap-2 text-neutral-600 font-bold px-1 transition-opacity">
            <Library className="size-5 text-[#A6B37D]" />
            <span>Your Library</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            setShowAuthPopup(false);
          }}
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          title={isExpanded ? "Collapse library" : "Expand library"}>
          {isExpanded ? <PanelLeftClose className="size-5" /> : <Library className="size-5 text-[#A6B37D]" />}
        </button>
      </div>

      {/* Library Section */}
      <div className="flex flex-col flex-1 overflow-hidden p-2 gap-2 relative">
        <div className={cn("flex items-center pt-2 pb-1", isExpanded ? "justify-between px-2" : "justify-center")}>
          {isExpanded && (
            <div className="flex-1 mr-2">
              {searchExpanded ? (
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 size-3.5 text-neutral-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setSearchExpanded(false);
                    }}
                    placeholder="Search in your library..."
                    className="w-full h-8 pl-8 pr-3 bg-neutral-100/80 border border-transparent hover:bg-neutral-200/50 text-xs text-neutral-800 rounded-md outline-none focus:bg-neutral-100 focus:border-[#A6B37D] focus:ring-1 focus:ring-[#A6B37D]/20 transition-all"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  title="Search library">
                  <Search className="size-4" />
                </button>
              )}
            </div>
          )}

          {/* Add Book Button */}
          {!isLoggedIn ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isExpanded) setIsExpanded(true);
                // Allow state to update and layout to shift before showing popup
                setTimeout(() => setShowAuthPopup(true), 50);
              }}
              className="auth-popup-trigger p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors shrink-0"
              title="Add book">
              <Plus className="size-5" />
            </button>
          ) : (
            <button
              className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors shrink-0"
              title="Add new book">
              <Plus className="size-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 mt-2 custom-scrollbar">
          {!isLoggedIn ? (
            isExpanded ? (
              <div ref={cardRef} className="flex flex-col items-start p-4 gap-4 bg-neutral-100/70 rounded-xl mx-2">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-bold text-neutral-800">Create your first collection</h4>
                  <p className="text-xs font-medium text-neutral-600">It's easy, we'll help you</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuthPopup(true);
                  }}
                  className="auth-popup-trigger bg-white text-neutral-900 text-xs font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform shadow-sm border border-neutral-200">
                  Create collection
                </button>
              </div>
            ) : null
          ) : /* TODO: Active Books List */
          isExpanded ? (
            <div className="flex flex-col items-start p-4 gap-4 bg-neutral-100/70 rounded-xl mx-2">
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-bold text-neutral-800">Create your first collection</h4>
                <p className="text-xs font-medium text-neutral-600">It's easy, we'll help you</p>
              </div>
              <button className="bg-white text-neutral-900 text-xs font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform shadow-sm border border-neutral-200">
                Create collection
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* CUSTOM POPUP IN PORTAL */}
      {showAuthPopup && typeof document !== "undefined" && createPortal(
        <div 
          style={{ top: popupPos.top, left: popupPos.left }}
          className="custom-auth-popup fixed w-[320px] p-4 rounded-xl shadow-xl border border-neutral-200 bg-white text-neutral-800 z-[9999] animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Arrow pointing Left */}
          <div className="absolute top-8 -left-[6px] w-3 h-3 bg-white border-l border-b border-neutral-200 rotate-45 rounded-sm" />
          
          <div className="space-y-2 relative z-10 bg-white">
            <h4 className="font-bold text-base">Create a collection</h4>
            <p className="text-sm font-medium pb-2 text-neutral-600">Log in to create and share collections.</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                className="text-neutral-500 text-sm font-bold hover:text-neutral-900 transition-colors px-4 py-2 rounded-full hover:bg-neutral-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAuthPopup(false);
                }}>
                Not now
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAuthPopup(false);
                  router.push("/login");
                }}
                className="bg-[#A6B37D] text-white text-sm font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform">
                Log in
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
