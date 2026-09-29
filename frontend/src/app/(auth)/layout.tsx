import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white flex flex-col items-center justify-center p-4 sm:p-8">
      
      {/* Decorative Blobs (Crayon / Brush stroke effect) 
          Filter blur besar menciptakan efek warna yang perlahan memudar dan menyebar */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-primary rounded-full opacity-40 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[500px] h-[500px] bg-primary rounded-full opacity-40 blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="mb-10 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.svg" 
            alt="Channel Logo" 
            width={80} 
            height={80} 
            priority 
            className="drop-shadow-sm"
          />
        </Link>
        
        {/* Main Content Container */}
        <div className="w-full">
          {children}
        </div>
      </div>
      
    </div>
  );
}
