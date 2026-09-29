import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white flex flex-col items-center justify-center pt-12 pb-32 px-4 sm:px-8">
      {/* Decorative Blobs (Crayon / Brush stroke effect)
          Filter blur besar menciptakan efek warna yang perlahan memudar dan menyebar */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-primary rounded-full opacity-40 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-primary rounded-full opacity-40 blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}

        <Image src="/logo-black.svg" alt="Channel Logo" width={72} height={72} priority />

        {/* Main Content Container */}
        <div className="w-full mt-2">{children}</div>
      </div>
    </div>
  );
}
