"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export function MyLibraryButton({ isLoggedIn, isMobile = false }: { isLoggedIn: boolean; isMobile?: boolean }) {
  const [open, setOpen] = useState(false);

  const buttonClass = isMobile
    ? "flex w-full items-center py-3 text-lg font-medium hover:text-[#A6B37D] transition-colors"
    : "text-base font-semibold hover:text-[#A6B37D] transition-colors text-gray-600";

  if (isLoggedIn) {
    return (
      <Link href="/my-library" className={buttonClass}>
        My Library
      </Link>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={buttonClass}>My Library</PopoverTrigger>
      <PopoverContent className="w-64 p-4 mt-2" align="center">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm font-medium text-gray-800">Sign in to see your books</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-gray-500 font-semibold"
              onClick={() => setOpen(false)}>
              Not now
            </Button>
            <Link href="/login" className="block w-full" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full font-semibold bg-[#A6B37D] hover:bg-[#8F9C66] text-white">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
