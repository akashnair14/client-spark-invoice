import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, LayoutDashboard, Users, FileText, PlusCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      label: "Clients",
      href: "/clients",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      label: "Invoices",
      href: "/invoices",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      label: "New Invoice",
      href: "/invoices/new",
      icon: <PlusCircle className="h-5 w-5 mr-2" />,
    },
  ];

  // Force close the sidebar when navigating
  const handleNavigation = () => {
    if (open) {
      onClose();
    }
  };

  const SidebarContent = (
    <div className="space-y-4 py-4 h-full flex flex-col">
      <div className="px-3 flex-1">
        <div className="mb-8">
          <h2 className="px-4 text-lg font-semibold">
            SparkInvoice
          </h2>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              onClick={handleNavigation}
            >
              <Button
                variant={pathname === route.href || pathname.startsWith(route.href + '/') ? "secondary" : "ghost"}
                className={cn("w-full justify-start", 
                  pathname === route.href || pathname.startsWith(route.href + '/') ? "bg-accent text-accent-foreground" : ""
                )}
              >
                {route.icon}
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 border-r bg-sidebar flex-col h-[calc(100vh-4rem)]">
        {SidebarContent}
      </aside>

      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <Button 
            variant="ghost" 
            className="absolute right-4 top-4"
            onClick={onClose}
            size="icon"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
          {SidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
