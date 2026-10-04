import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { CategoriesDesktop } from "./CategoriesDesktop";

export function DesktopNav() {
  return (
    <div className="hidden lg:flex items-center gap-8">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="Channel Logo" width={40} height={40} className="w-10 h-10" />
        <span className="font-bold text-xl text-[#A6B37D]">Channel</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link href="/" className="flex items-center text-neutral-500 hover:text-[#A6B37D] transition-colors" title="Home">
          <Home className="size-6" />
        </Link>
        <CategoriesDesktop />
      </nav>
    </div>
  );
}
