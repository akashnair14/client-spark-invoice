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
import { CircleUserRound, Menu, CircleCheck, LayoutDashboard } from "lucide-react";

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
  // add manage invoice status link
  {
    title: "Manage Invoice Status",
    url: "/manage-invoice-status",
    icon: CircleCheck, // Just as an example, set an icon from lucide-react or as used elsewhere
  },
  {
    title: "Clients",
    url: "/clients",
    icon: CircleUserRound,
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: "FileText",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 pt-6">
        <div className="px-4 py-2">
          <h1 className="font-bold text-lg">Invoicer</h1>
          <p className="text-muted-foreground text-xs">
            {user?.email || "No User"}
          </p>
        </div>
        <Separator />
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col gap-1 p-2">
            {sidebarItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active]:bg-muted data-[active]:text-muted-foreground",
                      isActive ? "active" : ""
                    )
                  }
                >
                  {typeof item.icon === 'string' ? (
                    <i className={`lucide lucide-${item.icon} h-4 w-4`}></i>
                  ) : (
                    <item.icon className="h-4 w-4" />
                  )}
                  {item.title}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Separator />
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              signOut();
              navigate("/auth");
            }}
          >
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
