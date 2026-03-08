import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CircleUserRound,
  CircleCheck,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: CircleUserRound },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Status", url: "/manage-invoice-status", icon: CircleCheck },
  { title: "Design", url: "/templates", icon: Palette },
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40">
      <div className="flex items-center justify-around h-[3.75rem] px-0.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all duration-150 min-w-0 flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/12 scale-110"
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px]",
                    isActive && "stroke-[2.5]"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] leading-none tracking-wide",
                  isActive ? "font-bold" : "font-medium"
                )}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
