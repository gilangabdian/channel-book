"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { CategoriesMobile } from "./CategoriesMobile";
import { useState } from "react";
import { UserNav } from "./UserNav";
import { Button } from "@/components/ui/Button";

interface MobileNavProps {
  user: any;
  profile: any;
}

export function MobileNav({ user, profile }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="p-2 -ml-2 text-neutral-700 hover:text-[#A6B37D] transition-colors">
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[75vw] sm:w-[50vw] flex flex-col p-6 border-r-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Mobile navigation menu for Channel Book.</SheetDescription>

        {/* Auth Section (Mobile only) */}
        <div className="flex flex-col gap-4 pb-6 mb-2 border-b border-neutral-100 sm:hidden">
          {user ? (
            <div className="flex items-center gap-3">
              <UserNav user={profile || { email: user.email }} />
              <span className="text-sm font-medium text-neutral-700">Account</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button className="w-full h-10 text-sm font-semibold bg-[#A6B37D] hover:bg-[#8F9C66] text-white">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full h-10 text-sm font-semibold border-[#A6B37D] text-[#A6B37D] hover:bg-[#A6B37D]/10">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col gap-1 flex-1 mt-2">
          <Link
            href="/"
            className="py-3 text-lg font-medium text-neutral-800 hover:text-[#A6B37D] transition-colors"
            onClick={() => setOpen(false)}>
            Home
          </Link>

          <CategoriesMobile closeSheet={() => setOpen(false)} />
        </nav>

        {/* Footer */}
        <div className="mt-auto pb-2">
          <p className="text-[11px] text-neutral-400">
            Channel. &copy; 2026. All rights reserved.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
