
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CircleUserRound, Menu, CircleCheck, LayoutDashboard, FileText } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

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

// Renamed component below: was Sidebar, now AppSidebar
const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Sheet/sidebar internal state is managed by SidebarProvider; props are not needed.
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden flex items-center justify-center p-2"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 max-w-[90vw] p-0 pt-6 flex flex-col">
        <div className="px-4 py-2 mb-2">
          <h1 className="font-bold text-lg">Invoicer</h1>
          <p className="text-muted-foreground text-xs break-all">{user?.email || "No User"}</p>
        </div>
        <Separator />
        <nav className="flex-1 overflow-y-auto">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col gap-1 p-2">
              {sidebarItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-muted text-primary"
                          : "text-muted-foreground"
                      )
                    }
                  >
                    {typeof item.icon === "string" ? (
                      <i className={`lucide lucide-${item.icon} h-4 w-4`}></i>
                    ) : (
                      <item.icon className="h-5 w-5 min-w-5" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <Separator className="mt-2" />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={async () => {
              await logout();
              navigate("/auth");
            }}
            aria-label="Sign out"
          >
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;
