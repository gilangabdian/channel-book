"use client";

import { useState } from "react";
import { MessageSquare, Send, Heart, MoreHorizontal, User } from "lucide-react";
import Image from "next/image";

type Comment = {
  id: string;
  author: string;
  avatar: string | null;
  text: string;
  date: string;
  likes: number;
};

const DUMMY_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "Narra Enthusiast",
    avatar: null,
    text: "This is an absolute masterpiece! I couldn't put it down. The character development is just brilliant.",
    date: "2 days ago",
    likes: 14,
  },
  {
    id: "2",
    author: "BookWorm99",
    avatar: null,
    text: "Does anyone else feel like the ending was a bit rushed? Still a solid 4/5 for me though.",
    date: "1 week ago",
    likes: 5,
  },
  {
    id: "3",
    author: "Syra Reader",
    avatar: null,
    text: "I read this after it was recommended on the front page. One of the best decisions I've made this year.",
    date: "1 month ago",
    likes: 42,
  },
];

export function DummyComments() {
  const [commentText, setCommentText] = useState("");

  return (
    <div className="w-full mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="size-5 text-[#A6B37D]" />
        <h3 className="text-xl font-bold text-neutral-800">Discussions</h3>
        <span className="ml-2 bg-neutral-100 text-neutral-500 text-xs font-semibold px-2 py-0.5 rounded-full">
          {DUMMY_COMMENTS.length}
        </span>
      </div>

      {/* Input Field */}
      <div className="flex gap-4 mb-8">
        <div className="size-10 rounded-full bg-[#A6B37D]/20 flex items-center justify-center shrink-0">
          <User className="size-5 text-[#A6B37D]" />
        </div>
        <div className="flex-1 relative">
          <textarea
            placeholder="What are your thoughts?"
            className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl px-4 py-3 min-h-[48px] outline-none focus:bg-white focus:border-[#A6B37D] focus:ring-2 focus:ring-[#A6B37D]/20 transition-all resize-none"
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="absolute right-3 bottom-3">
            <button className="bg-[#A6B37D] hover:bg-[#8F9A6C] text-white p-1.5 rounded-lg transition-colors">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {DUMMY_COMMENTS.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="size-10 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              {comment.avatar ? (
                <Image src={comment.avatar} alt={comment.author} width={40} height={40} className="object-cover" />
              ) : (
                <User className="size-5 text-neutral-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="bg-neutral-50 rounded-2xl rounded-tl-none px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-neutral-900">{comment.author}</span>
                  <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">{comment.text}</p>
              </div>
              <div className="flex items-center gap-4 mt-2 ml-2">
                <button className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-[#A6B37D] transition-colors">
                  <Heart className="size-3.5" />
                  {comment.likes}
                </button>
                <span className="text-xs text-neutral-400">{comment.date}</span>
                <button className="text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
