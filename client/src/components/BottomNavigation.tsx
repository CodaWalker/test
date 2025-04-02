import { Link, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Compass, Search, Heart, User } from "lucide-react";

const BottomNavigation = () => {
  const [location] = useLocation();
  const { setCurrentTab } = useStore();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <nav className="bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 shadow-md z-10">
      <div className="flex justify-around">
        <Link href="/">
          <a 
            className={`flex-1 py-3 flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
            onClick={() => handleTabChange('explore')}
          >
            <Compass className="text-lg w-5 h-5" />
            <span className="text-xs mt-1 font-medium">Explore</span>
          </a>
        </Link>
        
        <Link href="/search">
          <a 
            className={`flex-1 py-3 flex flex-col items-center ${isActive('/search') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
            onClick={() => handleTabChange('search')}
          >
            <Search className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        
        <Link href="/favorites">
          <a 
            className={`flex-1 py-3 flex flex-col items-center ${isActive('/favorites') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
            onClick={() => handleTabChange('favorites')}
          >
            <Heart className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">Favorites</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a 
            className={`flex-1 py-3 flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'}`}
            onClick={() => handleTabChange('profile')}
          >
            <User className="text-lg w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
