import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Compass, Search, Heart, User } from "lucide-react";

const BottomNavigation = () => {
  const [location, navigate] = useLocation();
  const { setCurrentTab } = useStore();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleTab = (path: string, tab: string) => {
    navigate(path);
    setCurrentTab(tab);
  };

  return (
    <nav className="bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 shadow-md z-10">
      <div className="flex justify-around">
        <button
          className={`flex-1 py-3 flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
          onClick={() => handleTab('/', 'explore')}
        >
          <Compass className="text-lg w-5 h-5" />
          <span className="text-xs mt-1 font-medium">Исследовать</span>
        </button>
        
        <button
          className={`flex-1 py-3 flex flex-col items-center ${isActive('/search') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
          onClick={() => handleTab('/search', 'search')}
        >
          <Search className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Поиск</span>
        </button>
        
        <button
          className={`flex-1 py-3 flex flex-col items-center ${isActive('/favorites') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
          onClick={() => handleTab('/favorites', 'favorites')}
        >
          <Heart className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Избранное</span>
        </button>
        
        <button
          className={`flex-1 py-3 flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
          onClick={() => handleTab('/profile', 'profile')}
        >
          <User className="text-lg w-5 h-5" />
          <span className="text-xs mt-1">Профиль</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
