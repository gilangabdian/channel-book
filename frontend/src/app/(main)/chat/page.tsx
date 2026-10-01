"use client";

import { Sparkles, History, SquarePen, ArrowUp, Paperclip, Image as ImageIcon, FileText, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

export default function MobileChatPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: wire to actual auth state
  const [authPopoverOpen, setAuthPopoverOpen] = useState(false);
  const [attachPopoverOpen, setAttachPopoverOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleSend = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    if (!isLoggedIn) {
      setAuthPopoverOpen(true);
      return;
    }

    // TODO: Send message logic
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 shrink-0 bg-white border-b border-neutral-200">
        {/* Kiri: Avatar Default Tanda Tanya */}
        <div className="flex items-center gap-2">
          <div className="size-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 font-bold text-sm shadow-sm border border-neutral-200">
            ?
          </div>
          <span className="font-bold text-neutral-800 text-sm">AI Reading Guide</span>
        </div>
        
        {/* Kanan: Action Menus */}
        <div className="flex items-center gap-1">
          <button 
            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
            title="New Chat"
          >
            <SquarePen className="size-4.5" />
          </button>
          <button 
            onClick={() => setHistoryOpen(true)}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors"
            title="History"
          >
            <History className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Chat Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white overflow-y-auto">
        <h3 className="font-bold text-neutral-800 text-lg mb-2">How can I help you today?</h3>
      </div>

      {/* Input Box Area */}
      <div className="p-4 bg-white pb-6 shrink-0 border-t border-transparent">
        {/* Popover for Auth Guard attached to the whole input area */}
        <Popover open={authPopoverOpen} onOpenChange={setAuthPopoverOpen}>
          <PopoverTrigger>
            <div className="w-full relative" />
          </PopoverTrigger>
          <PopoverContent side="top" align="center" className="w-[300px] p-4 rounded-xl shadow-xl border-neutral-200 mb-2">
            <div className="space-y-3 text-center">
              <h4 className="font-bold text-sm text-neutral-800">Welcome to AI Reading Guide</h4>
              <p className="text-xs text-neutral-600">
                Please log in or register to use the AI Reading Guide and get personalized book recommendations.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Link
                  href="/login"
                  className="flex-1 bg-[#A6B37D] text-white text-xs font-bold py-2 rounded-md hover:bg-[#8f9b6b] transition-colors"
                  onClick={() => setAuthPopoverOpen(false)}>
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 bg-neutral-100 text-neutral-700 text-xs font-bold py-2 rounded-md hover:bg-neutral-200 transition-colors border border-neutral-200"
                  onClick={() => setAuthPopoverOpen(false)}>
                  Register
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <form onSubmit={handleSend} className="relative flex flex-col bg-neutral-100 border border-neutral-200 rounded-3xl focus-within:ring-2 focus-within:ring-[#A6B37D]/50 focus-within:border-[#A6B37D] transition-all p-1.5">
          {/* Input Field (Textarea) */}
          <textarea 
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Ask anything..." 
            rows={1}
            className="w-full bg-transparent px-3 pt-2 pb-1 text-sm focus:outline-none placeholder:text-neutral-400 resize-none max-h-[150px] leading-relaxed text-left align-top"
          />

          {/* Bottom Row: Attach & Send */}
          <div className="flex items-center justify-between mt-1 px-1">
            {/* Attachment Icon with Popover */}
            <Popover open={attachPopoverOpen} onOpenChange={setAttachPopoverOpen}>
              <PopoverTrigger type="button" className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors rounded-full hover:bg-neutral-200">
                <Paperclip className="size-5" />
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-48 p-2 rounded-xl shadow-lg border-neutral-200 mb-2">
                <div className="flex flex-col gap-1">
                  <button 
                    type="button" 
                    onClick={() => { setAttachPopoverOpen(false); /* Handle img upload */ }} 
                    className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors text-left"
                  >
                    <ImageIcon className="size-4 text-[#A6B37D]" />
                    <span>Upload Image</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setAttachPopoverOpen(false); /* Handle pdf upload */ }} 
                    className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors text-left"
                  >
                    <FileText className="size-4 text-[#A6B37D]" />
                    <span>Upload PDF</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Send Button */}
            <button 
              type="submit" 
              className={cn(
                "p-1.5 rounded-full transition-colors shrink-0",
                message.trim() ? "bg-[#A6B37D] text-white hover:bg-[#8f9b6b]" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              )}
              disabled={!message.trim()}
            >
              <ArrowUp className="size-5" />
            </button>
          </div>
        </form>
      </div>

      {/* History Slide-over */}
      <div 
        className={cn(
          "absolute inset-0 z-40 transition-opacity bg-black/20",
          historyOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setHistoryOpen(false)}
      />
      <div 
        className={cn(
          "absolute top-0 right-0 h-full bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out w-full md:w-[350px] flex flex-col",
          historyOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-14 border-b flex items-center justify-between px-4">
          <h2 className="font-bold text-neutral-800">Chat History</h2>
          <button onClick={() => setHistoryOpen(false)} className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-neutral-500 text-center mt-4">No history yet.</p>
        </div>
      </div>
    </div>
  );
}
