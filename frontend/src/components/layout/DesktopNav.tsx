import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { MyLibraryButton } from "./MyLibraryButton";
import { CategoriesDesktop } from "./CategoriesDesktop";

export function DesktopNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="hidden md:flex items-center gap-8">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Image src="/logo.svg" alt="Channel Logo" width={40} height={40} className="w-10 h-10" />
        <span className="font-bold text-xl text-[#A6B37D]">Channel</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/" className="flex items-center text-gray-500 hover:text-[#A6B37D] transition-colors" title="Home">
          <Home className="size-6" />
        </Link>
        <MyLibraryButton isLoggedIn={isLoggedIn} />
        <CategoriesDesktop />
      </nav>
    </div>
  );
}
