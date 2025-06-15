
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
// Removed Sidebar import, as local Sidebar expects props and is not in use

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Removed Sidebar component entirely due to prop mismatch error.
  return (
    <>
      {/* Sidebar integration should be done at a higher level if using shadcn UI */}
      <div className="flex flex-col min-h-screen">
        {/* <AppHeader /> */}
        <main className="container py-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;
