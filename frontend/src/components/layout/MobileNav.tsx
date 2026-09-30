"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MyLibraryButton } from "./MyLibraryButton";
import { useState } from "react";

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="p-2 -ml-2 text-gray-700 hover:text-[#A6B37D] transition-colors">
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[75vw] sm:w-[50vw] flex flex-col p-6 border-r-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Mobile navigation menu for Channel Book.</SheetDescription>

        {/* Menu Links */}
        <nav className="flex flex-col gap-1 flex-1 mt-6">
          <Link
            href="/"
            className="py-3 text-lg font-medium text-gray-800 hover:text-[#A6B37D] transition-colors"
            onClick={() => setOpen(false)}>
            Home
          </Link>

          <div className="flex items-center gap-4">
            <MyLibraryButton isLoggedIn={isLoggedIn} isMobile={true} />
          </div>
        </nav>

        {/* Footer */}
        <div className="mt-auto pb-2">
          <p className="text-[11px] text-gray-400">
            Channel. &copy; 2026. All rights reserved.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
