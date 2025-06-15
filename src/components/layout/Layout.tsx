
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Removed AppHeader since the file/component does not exist and to fix build errors.
  return (
    <>
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        {/* <AppHeader /> */}
        <main className="container py-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;

