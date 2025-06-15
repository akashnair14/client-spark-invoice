import React from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="container py-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;
