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
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CircleUserRound,
  LogOut,
  CircleCheck,
  LayoutDashboard,
  FileText,
  Palette,
  Settings,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Manage Status", url: "/manage-invoice-status", icon: CircleCheck },
  { title: "Clients", url: "/clients", icon: CircleUserRound },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Templates", url: "/templates", icon: Palette },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-5 px-2">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/35 font-semibold mb-2 px-3">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={isCollapsed ? item.title : undefined}>
                      <NavLink
                        to={item.url}
                        end
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] w-full transition-all duration-150 relative",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                        )}
                        <item.icon
                          className={cn(
                            "h-[18px] w-[18px] shrink-0 transition-colors",
                            isActive ? "text-primary" : ""
                          )}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
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

      <SidebarFooter className="px-2 pb-3">
        <SidebarSeparator className="mb-2" />
        {!isCollapsed && user?.email && (
          <p className="text-[11px] text-sidebar-foreground/40 truncate px-3 mb-1.5 font-medium">
            {user.email}
          </p>
        )}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={cn(
            "text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all",
            !isCollapsed && "w-full justify-start gap-2"
          )}
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="text-[13px]">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
