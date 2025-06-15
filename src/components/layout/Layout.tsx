
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  // Sidebar open/close tracked with SidebarProvider
  
  useEffect(() => {
    // On route change close mobile sidebar sheet automatically (SidebarProvider does this)
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Top navbar with always-visible trigger on mobile */}
        <div className="fixed w-full z-30">
          <Navbar
            onMenuClick={() => {
              // The SidebarTrigger is now always rendered, handle in Navbar.
            }}
          />
        </div>
        {/* Sidebar (with space for fixed navbar at top) */}
        <div className="pt-16 flex-shrink-0">
          <AppSidebar />
        </div>
        {/* Main content, offset for navbar */}
        <SidebarInset className="flex-1 pt-16 bg-background">
          <div className="page-container">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

