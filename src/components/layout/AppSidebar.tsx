import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CircleCheck,
  CircleUserRound,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Invoice Status",
    url: "/manage-invoice-status",
    icon: CircleCheck,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: CircleUserRound,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
  },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className="lg:w-64 w-16 transition-all duration-300 bg-sidebar px-0 shadow-md"
      collapsible
    >
      {/* Mini trigger in collapsed mode */}
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent className="flex-1 flex flex-col">
        <SidebarGroup>
          <div className="pt-5 pb-3 px-4">
            <h1 className="font-bold text-lg tracking-tight">Invoicer</h1>
            <div className="text-xs text-muted-foreground break-all">{user?.email ?? ""}</div>
          </div>
          <SidebarGroupLabel className="pl-4 text-xs text-muted-foreground mt-1 mb-0.5">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      className={({ isActive: navActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium w-full transition-colors focus:outline-none",
                          navActive
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )
                      }
                      end
                    >
                      <item.icon className="h-5 w-5 min-w-5" />
                      <span className="truncate hidden lg:inline">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Logout button at bottom */}
        <SidebarFooter className="flex-col gap-2 mt-auto mb-4">
          <Button
            variant="outline"
            className="w-full flex justify-center items-center gap-2"
            onClick={async () => logout()}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4 mr-2" /> <span className="hidden lg:inline">Sign Out</span>
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
