
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border h-14 md:h-16 flex items-center px-4 md:px-6 sticky top-0 z-40">
      {/* Sidebar trigger - desktop only */}
      {!isMobile && (
        <div className="flex">
          <SidebarTrigger />
        </div>
      )}
      <div className="flex items-center gap-2 ml-1 md:ml-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">S</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">
          Spark<span className="text-primary">Invoice</span>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
