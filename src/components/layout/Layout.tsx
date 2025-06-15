
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import Navbar from "@/components/layout/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // There should be no direct Sidebar component used here,
  // just AppSidebar which knows how to manage state internally.
  return (
    <SidebarProvider>
      <Navbar />
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 container py-8">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
