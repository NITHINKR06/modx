import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newIsDark = !isDark;
    
    if (newIsDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    setIsDark(newIsDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 hover:bg-foreground/10"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {isDark ? (
          <Moon
            size={24}
            className="text-foreground/70 hover:text-foreground transition-colors"
          />
        ) : (
          <Sun
            size={24}
            className="text-foreground/70 hover:text-foreground transition-colors"
          />
        )}
      </div>
    </button>
  );
};
