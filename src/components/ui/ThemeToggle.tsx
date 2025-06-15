
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ToggleRight, ToggleLeft } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-colors"
    >
      {isDark ? (
        <ToggleLeft className="w-5 h-5" aria-hidden />
      ) : (
        <ToggleRight className="w-5 h-5" aria-hidden />
      )}
      <span className="sr-only">Toggle dark or light theme</span>
    </Button>
  );
}
