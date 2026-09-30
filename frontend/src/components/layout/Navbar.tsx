import { createClient } from "@/lib/supabase/server";
import { UserNav } from "./UserNav";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("username, avatar_url, email").eq("id", user.id).single();
    profile = data;
  }

  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl flex h-16 items-center px-4 sm:px-8 justify-between gap-4">
        {/* MOBILE MENU (Visible only on small screens) */}
        <div className="md:hidden flex items-center">
          <MobileNav isLoggedIn={isLoggedIn} />
        </div>

        {/* DESKTOP MENU (Hidden on small screens) */}
        <DesktopNav isLoggedIn={isLoggedIn} />

        {/* SEARCH BAR (Flexible center, visible on both mobile and desktop) */}
        <div className="flex-1 max-w-xl -ml-2 mr-2">
          <SearchBar />
        </div>

        {/* RIGHT SIDE: AUTH / PROFILE */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <button className="hidden sm:flex p-2 text-gray-500 hover:text-[#A6B37D] hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="size-5" />
                {/* Red dot for notification mockup */}
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></span>
              </button>
              <UserNav user={profile || { email: user.email }} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Sign up hidden on mobile as requested */}
              <Link href="/signup" className="hidden sm:block">
                <Button
                  variant="outline"
                  className="w-24 h-10 text-sm font-semibold border-[#A6B37D] hover:bg-[#A6B37D]/10">
                  Sign up
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-20 sm:w-24 h-10 text-sm font-semibold bg-[#A6B37D] hover:bg-[#8F9C66] text-white">
                  Log in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
