import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "SI";

  return (
    <header className="bg-background/80 backdrop-blur-xl border-b border-border/60 h-14 flex items-center px-3 md:px-5 sticky top-0 z-40 shrink-0">
      {/* Left: sidebar trigger + logo */}
      <div className="flex items-center gap-1">
        {!isMobile && <SidebarTrigger className="text-muted-foreground hover:text-foreground" />}
        <div className="flex items-center gap-2 ml-1">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          {!isMobile && (
            <span className="font-bold text-lg tracking-tight text-foreground select-none">
              Spark<span className="text-primary">Invoice</span>
            </span>
          )}
          {isMobile && (
            <span className="font-bold text-base tracking-tight text-foreground select-none">
              Spark<span className="text-primary">Invoice</span>
            </span>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
        </Button>
        <Avatar className="h-8 w-8 border border-border/50 ml-1 cursor-pointer">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Navbar;
