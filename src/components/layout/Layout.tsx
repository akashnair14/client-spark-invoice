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
      <div className="app-background flex flex-col h-screen w-full overflow-hidden">
        <Navbar />
        <div className="flex flex-1 min-h-0 w-full">
          {!isMobile && <AppSidebar />}
          <main className="main-content flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-3 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
