
import React from "react";
import { Button } from "@/components/ui/button";
import { Google } from "lucide-react";

interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider?: "google"; // for future multi-provider support
  children: React.ReactNode;
}
const SocialButton: React.FC<SocialButtonProps> = ({ onClick, children, provider = "google", ...props }) => (
  <Button
    onClick={onClick}
    variant="outline"
    className="w-full flex gap-2 bg-white/5 hover:bg-blue-800/30 border-blue-700/40 dark:border-blue-600/40 transition-colors text-base font-medium justify-center items-center py-2 shadow shadow-blue-900/20 mb-2"
    type="button"
    {...props}
  >
    {provider === "google" && <Google className="w-5 h-5 mr-1 text-[#2186f7]" />}
    {children}
  </Button>
);

export default SocialButton;
