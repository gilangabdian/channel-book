import Navbar from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { AIChatSidebar } from "@/components/layout/AIChatSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Get actual auth status from Supabase
  const isLoggedIn = false; 

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />
      
      <div className="flex flex-1 w-full h-[calc(100vh-64px)]">
        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden lg:flex shrink-0 h-full bg-white border-r border-neutral-200">
          <LeftSidebar isLoggedIn={isLoggedIn} />
        </aside>

        {/* Main Area */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          {children}
        </main>
        
        {/* Right Sidebar (AI Chat) */}
        <AIChatSidebar />
      </div>
    </div>
  );
}
