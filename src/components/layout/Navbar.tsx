
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
  className?: string;
}

const Navbar = ({ onMenuClick, className }: NavbarProps) => {
  return (
    <header className={cn("bg-white border-b h-16 flex items-center px-4 md:px-6", className)}>
      <Button
        variant="ghost"
        className="md:hidden"
        size="icon"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="flex items-center gap-2 ml-2">
        <span className="text-primary font-bold text-lg md:text-xl">
          SparkInvoice
        </span>
      </div>

      <div className="ml-auto flex items-center space-x-2">
        {/* Right side navbar items can be added here in the future */}
      </div>
    </header>
  );
};

export default Navbar;
