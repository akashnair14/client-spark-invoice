
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
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleUserRound, Menu, CircleCheck, LayoutDashboard, FileText } from "lucide-react";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, isMobile } = useSidebar();

  const isActive = (url: string) => location.pathname === url;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-muted text-primary font-medium"
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar
      className={cn(
        state === "collapsed" ? "w-14" : "w-60",
        "h-full md:h-screen flex-shrink-0 transition-all duration-200"
      )}
      collapsible="icon"
    >
      {/* always-visible trigger for mini mode + close */}
      <SidebarTrigger className="m-2 self-end" />
      <SidebarContent>
        <SidebarGroup>
          {/* Brand/header */}
          <div className={cn(
            "px-4 py-4 whitespace-nowrap",
            state === "collapsed" ? "px-0 text-center" : ""
          )}>
            <h1 className={cn(
              "font-bold text-lg transition-all duration-200",
              state === "collapsed" ? "text-base" : ""
            )}>
              {state === "collapsed" ? "I" : "Invoicer"}
            </h1>
            {state !== "collapsed" && (
              <p className="text-muted-foreground text-xs break-all">{user?.email || "No User"}</p>
            )}
          </div>
          <SidebarSeparator />
          <SidebarGroupLabel className={cn(
            "pt-2 pb-0 text-xs",
            state === "collapsed" ? "opacity-0 h-0" : "px-4"
          )}>
            Main Menu
          </SidebarGroupLabel>
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
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full focus:outline-none transition-colors",
                          getNavCls({ isActive })
                        )
                      }
                    >
                      <item.icon className="h-5 w-5 mx-auto" />
                      {/* Show text only if not collapsed */}
                      <span
                        className={cn(
                          "truncate transition-all duration-200",
                          state === "collapsed"
                            ? "hidden"
                            : "inline"
                        )}
                      >
                        {item.title}
                      </span>
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
        <Button
          variant="outline"
          className="w-full justify-center mt-2"
          onClick={async () => {
            await logout();
            navigate("/auth");
          }}
          aria-label="Sign out"
        >
          <span className={cn(
            state === "collapsed" ? "hidden" : "inline"
          )}>
            Sign Out
          </span>
          <Menu className={cn(
            "w-4 h-4",
            state === "collapsed" ? "inline-block ml-0" : "hidden"
          )} />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
