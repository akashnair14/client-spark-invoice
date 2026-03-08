
import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleUserRound, LogOut, CircleCheck, LayoutDashboard, FileText, Palette } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Manage Status", url: "/manage-invoice-status", icon: CircleCheck },
  { title: "Clients", url: "/clients", icon: CircleUserRound },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Templates", url: "/templates", icon: Palette },
];

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={cn(
        isCollapsed ? "w-[4.5rem]" : "w-60",
        "h-screen flex-shrink-0 transition-all duration-200"
      )}
      collapsible="icon"
    >
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-lg text-sm w-full transition-all relative group",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                          isActive ? "bg-primary/15 text-primary" : ""
                        )}>
                          <item.icon className="h-[18px] w-[18px]" />
                        </div>
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                        {isCollapsed && (
                          <span className="absolute left-16 whitespace-nowrap bg-foreground text-background text-xs rounded-md px-2.5 py-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-50 shadow-lg transition-opacity">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        {!isCollapsed && user?.email && (
          <div className="px-4 py-2">
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "mx-2 mb-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10",
            !isCollapsed && "w-[calc(100%-1rem)] justify-start gap-2"
          )}
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
