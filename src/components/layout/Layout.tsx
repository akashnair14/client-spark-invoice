
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        <div className="flex flex-1 min-h-0 w-full">
          {/* Desktop sidebar only */}
          {!isMobile && <AppSidebar />}
          <main className="main-content flex-1 min-w-0 p-3 md:p-6 lg:p-8 overflow-x-auto">
            {children}
          </main>
        </div>
        {/* Mobile bottom nav */}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
