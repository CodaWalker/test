import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Moon, Sun, Menu, SlidersHorizontal } from "lucide-react";

const Header = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    toggleMenu,
    toggleFilter,
  } = useStore();

  return (
    <header className="px-4 py-3 flex items-center justify-between bg-white dark:bg-neutral-800 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
      >
        <Menu className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
      </Button>
      
      <h1 className="font-bold text-xl text-primary">TravelSwipe</h1>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFilter}
          className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          <SlidersHorizontal className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-neutral-200" />
          ) : (
            <Moon className="h-5 w-5 text-neutral-700" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
