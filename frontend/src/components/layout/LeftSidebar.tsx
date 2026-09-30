"use client";

import { Plus, Library, PanelLeftClose } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  isLoggedIn: boolean;
}

export function LeftSidebar({ isLoggedIn }: LeftSidebarProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div 
      className={cn(
        "flex flex-col h-full bg-white border-r border-neutral-200",
        isExpanded ? "w-[280px]" : "w-[60px]"
      )}
    >
      {/* Header / Collapse Toggle */}
      <div className={cn(
        "flex items-center h-14 border-b border-transparent shrink-0 px-3",
        isExpanded ? "justify-between" : "justify-center"
      )}>
        {isExpanded && (
          <div className="flex items-center gap-2 text-neutral-600 font-bold px-1 transition-opacity">
            <Library className="size-5 text-[#A6B37D]" />
            <span>Your Library</span>
          </div>
        )}
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
          title={isExpanded ? "Collapse library" : "Expand library"}
        >
          {isExpanded ? <PanelLeftClose className="size-5" /> : <Library className="size-5 text-[#A6B37D]" />}
        </button>
      </div>

      {/* Library Section */}
      <div className="flex flex-col flex-1 overflow-hidden p-3 gap-2">
        <div className={cn(
          "flex items-center",
          isExpanded ? "justify-between px-1" : "justify-center"
        )}>
          {isExpanded && (
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Reading Now
            </span>
          )}
          
          {/* Add Book Button */}
          {!isLoggedIn ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors" title="Add book">
                <Plus className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4 rounded-xl shadow-xl border-neutral-200" side="right" align="start">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-neutral-800">Track Your Journey</h4>
                  <p className="text-xs text-neutral-600">
                    Log in to add books you&apos;re currently reading and keep track of your progress.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      href="/login"
                      className="flex-1 bg-[#A6B37D] text-white text-xs font-bold py-2 rounded-md text-center hover:bg-[#8f9b6b] transition-colors"
                      onClick={() => setPopoverOpen(false)}>
                      Log In
                    </Link>
                    <button
                      className="flex-1 bg-neutral-100 text-neutral-700 text-xs font-bold py-2 rounded-md text-center hover:bg-neutral-200 transition-colors"
                      onClick={() => setPopoverOpen(false)}>
                      Not Now
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <button className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors" title="Add new book">
              <Plus className="size-4" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 mt-2 custom-scrollbar">
          {!isLoggedIn ? (
            isExpanded ? (
              <div className="flex flex-col items-center justify-center text-center bg-neutral-50 rounded-lg border border-neutral-100 border-dashed h-32 px-4">
                <span className="text-xs text-neutral-500 font-medium">Your reading list is empty.</span>
              </div>
            ) : null
          ) : (
            /* TODO: Active Books List */
            isExpanded ? (
              <div className="flex flex-col items-center justify-center text-center bg-neutral-50 rounded-lg border border-neutral-100 border-dashed h-32 px-4">
                <span className="text-xs text-neutral-500 font-medium">No active books. Click + to add.</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
