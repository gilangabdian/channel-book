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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl flex h-16 items-center px-4 sm:px-8 justify-between gap-4">
        {/* MOBILE & TABLET MENU (Visible up to lg) */}
        <div className="lg:hidden flex items-center">
          <MobileNav user={user} profile={profile} />
        </div>

        {/* DESKTOP MENU (Hidden up to lg) */}
        <DesktopNav />

        {/* SEARCH BAR (Flexible center, visible on both mobile and desktop) */}
        <div className="flex-1 w-full sm:max-w-md lg:mr-auto lg:ml-4 sm:mx-4">
          <SearchBar />
        </div>

        {/* RIGHT SIDE: AUTH / PROFILE */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {/* Notification Bell */}
              <button className="p-2 text-neutral-500 hover:text-[#A6B37D] hover:bg-neutral-100 rounded-full transition-colors relative">
                <Bell className="size-5" />
                {/* Red dot for notification mockup */}
                <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full"></span>
              </button>
              <UserNav user={profile || { email: user.email }} />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="w-24 h-10 text-sm font-semibold border-[#A6B37D] text-[#A6B37D] hover:bg-[#A6B37D]/10">
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
