
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavbarProps {
  onMenuClick?: () => void;
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  return (
    <header className="bg-white dark:bg-[#18181b] border-b h-16 flex items-center px-4 md:px-6">
      {/* Always visible sidebar trigger (hidden on large) */}
      <div className="flex md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2 ml-2">
        <span className="text-primary font-bold text-lg md:text-xl">
          SparkInvoice
        </span>
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;

