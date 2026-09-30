"use client";

import { Sparkles, X, ChevronRight, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Animasi tooltip awal
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      {/* Floating Toggle Button - Muncul saat sidebar tertutup */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {/* Tooltip Pengenalan AI */}
          <div 
            className={cn(
              "bg-white shadow-xl border border-[#A6B37D]/30 p-3 rounded-2xl rounded-br-none transition-all duration-500 transform origin-bottom-right max-w-[200px]",
              showTooltip ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-4 pointer-events-none"
            )}
          >
            <div className="relative">
              <button 
                onClick={() => setShowTooltip(false)}
                className="absolute -top-1 -right-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="size-3" />
              </button>
              <p className="text-xs text-neutral-700 font-medium leading-relaxed pr-3">
                Bingung mau baca apa? Tanya Narra & Syra yuk! ✨
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setShowTooltip(false);
            }}
            className="flex items-center justify-center size-14 rounded-full text-white shadow-lg shadow-[#A6B37D]/30 transition-transform hover:scale-105 active:scale-95 bg-[#A6B37D]"
            title="Open AI Reading Guide"
          >
            <Sparkles className="size-6" />
          </button>
        </div>
      )}

      {/* Sidebar Panel AI */}
      <div 
        className={cn(
          "h-full bg-white border-l border-neutral-200 transition-all duration-300 flex flex-col shrink-0",
          isOpen ? "w-[350px]" : "w-0 border-l-0 overflow-hidden"
        )}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="h-14 border-b border-neutral-200 flex items-center justify-between px-4 shrink-0 bg-neutral-50/50">
              <div className="flex items-center gap-2 text-neutral-800 font-bold">
                <Sparkles className="size-5 text-[#A6B37D]" />
                <span>AI Reading Guide</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 rounded-md transition-colors"
                title="Close AI Sidebar"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Chat Content Area Placeholder */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
              <div className="size-16 bg-neutral-100 rounded-full flex items-center justify-center shadow-sm mb-4 text-3xl">
                🤖
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">Welcome to AI Chat</h3>
              <p className="text-sm text-neutral-500">
                Pilih maskot Narra atau Syra, lalu tanyakan rekomendasi buku favoritmu di sini.
              </p>
            </div>

            {/* Input Box Placeholder */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50/50">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tanya rekomendasi..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A6B37D] focus:border-transparent transition-all disabled:opacity-50"
                  disabled
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#A6B37D] text-white rounded-full hover:bg-[#8f9b6b] transition-colors" disabled>
                  <MessageSquare className="size-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
