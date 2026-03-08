import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "SI";

  return (
    <header className="glass h-14 flex items-center px-3 md:px-5 sticky top-0 z-40 shrink-0">
      {/* Left: sidebar trigger + logo */}
      <div className="flex items-center gap-1">
        {!isMobile && <SidebarTrigger className="text-muted-foreground hover:text-foreground" />}
        <div className="flex items-center gap-2.5 ml-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow">
            <span className="text-primary-foreground font-bold text-sm tracking-tight">S</span>
          </div>
          <span className={cn("font-bold tracking-tight text-foreground select-none", isMobile ? "text-base" : "text-lg")}>
            Spark<span className="text-primary">Invoice</span>
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-0.5">
        <ThemeToggle />
        <NotificationBell />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none ml-1">
              <Avatar className="h-8 w-8 border border-border/50 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">Account</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user?.email || "Not signed in"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              <User className="mr-2 h-4 w-4" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => { await logout(); navigate("/auth"); }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

function NotificationBell() {
  const { invoices, loading } = useDashboardData();

  const notifications = useMemo(() => {
    if (loading || !invoices.length) return [];
    const items: { text: string; type: "destructive" | "warning" | "success" }[] = [];
    const overdueCount = invoices.filter((i) => i.status === "overdue").length;
    if (overdueCount > 0) items.push({ text: `${overdueCount} overdue invoice${overdueCount > 1 ? "s" : ""}`, type: "destructive" });
    const pendingCount = invoices.filter((i) => i.status === "pending").length;
    if (pendingCount > 0) items.push({ text: `${pendingCount} pending invoice${pendingCount > 1 ? "s" : ""}`, type: "warning" });
    const draftCount = invoices.filter((i) => i.status === "draft").length;
    if (draftCount > 0) items.push({ text: `${draftCount} draft${draftCount > 1 ? "s" : ""}`, type: "warning" });
    const paidCount = invoices.filter((i) => i.status === "paid").length;
    if (paidCount > 0) items.push({ text: `${paidCount} paid invoice${paidCount > 1 ? "s" : ""}`, type: "success" });
    return items;
  }, [invoices, loading]);

  const hasAlerts = notifications.some((n) => n.type === "destructive" || n.type === "warning");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative" aria-label="Notifications">
          <Bell className="h-[18px] w-[18px]" />
          {hasAlerts && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b border-border/60">
          <p className="text-sm font-semibold">Notifications</p>
        </div>
        <div className="p-2 max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-lg text-sm mb-0.5 transition-colors",
                  n.type === "destructive" && "bg-destructive/5 text-destructive",
                  n.type === "warning" && "bg-warning/5 text-warning",
                  n.type === "success" && "bg-success/5 text-success"
                )}
              >
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  n.type === "destructive" && "bg-destructive",
                  n.type === "warning" && "bg-warning",
                  n.type === "success" && "bg-success"
                )} />
                <span className="font-medium">{n.text}</span>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default Navbar;
