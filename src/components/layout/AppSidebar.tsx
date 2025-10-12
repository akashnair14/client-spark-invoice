
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
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleUserRound, Menu, CircleCheck, LayoutDashboard, FileText, Palette } from "lucide-react";

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
  {
    title: "Templates",
    url: "/templates",
    icon: Palette,
  },
];

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const isActive = (url: string) => location.pathname === url;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-muted text-primary font-medium"
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar
      className={cn(
        isCollapsed ? "w-14" : "w-56",
        "h-full md:h-screen flex-shrink-0 border-r border-border bg-background transition-all duration-200 min-h-screen"
      )}
      collapsible="icon"
    >
      
      <SidebarContent>
        <SidebarGroup>
          {/* Minimal brand/header */}
          <div className={cn(
            "py-4 flex items-center justify-center",
            isCollapsed ? "px-0" : "px-4"
          )}>
            <h1 className={cn(
              "font-bold text-xl text-primary tracking-tight transition-all duration-200",
              isCollapsed ? "text-lg" : "text-xl"
            )}>
              {isCollapsed ? "I" : "Invoicer"}
            </h1>
          </div>
          <SidebarSeparator />
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 p-0.5 py-2 my-1 rounded-md text-[15px] w-full focus:outline-none transition-colors relative group",
                          getNavCls({ isActive })
                        )
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg",
                          isActive(item.url)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      {/* Only show title if not collapsed */}
                      {!isCollapsed && (
                        <span className="truncate px-1">{item.title}</span>
                      )}
                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <span className="absolute left-14 whitespace-nowrap bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto ml-1 z-20 transition">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="text-xs text-muted-foreground break-all mb-1 font-medium">
              {user?.email || "No User"}
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-10 h-10 m-2 flex items-center justify-center",
            !isCollapsed && "w-full px-3 justify-start h-10"
          )}
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          aria-label="Sign out"
        >
          <Menu className="w-5 h-5" />
          {!isCollapsed && (
            <span className="ml-2 text-sm">Sign Out</span>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

