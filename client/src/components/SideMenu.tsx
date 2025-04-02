import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  User, Heart, Route as RouteIcon, Settings, 
  HelpCircle, LogOut, X 
} from "lucide-react";
import { useStore } from "@/lib/store";

const SideMenu = () => {
  const { isMenuOpen, toggleMenu, userProfile } = useStore();
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  if (!isMenuOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
          
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-[80%] max-w-sm bg-white dark:bg-neutral-800 shadow-xl flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-4 border-b dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium dark:text-white">
                    {userProfile?.username || "Guest"}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {userProfile?.email || "guest@example.com"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="py-2 flex-1 overflow-y-auto">
              <Link href="/profile">
                <a className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={toggleMenu}>
                  <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-800 dark:text-neutral-200">My Profile</span>
                </a>
              </Link>
              <Link href="/favorites">
                <a className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={toggleMenu}>
                  <Heart className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-800 dark:text-neutral-200">Favorites</span>
                </a>
              </Link>
              <Link href="/routes">
                <a className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={toggleMenu}>
                  <RouteIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-800 dark:text-neutral-200">My Routes</span>
                </a>
              </Link>
              <Link href="/settings">
                <a className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={toggleMenu}>
                  <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-800 dark:text-neutral-200">Settings</span>
                </a>
              </Link>
              
              <div className="border-t dark:border-neutral-700 my-2"></div>
              
              <Link href="/help">
                <a className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={toggleMenu}>
                  <HelpCircle className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-800 dark:text-neutral-200">Help & Support</span>
                </a>
              </Link>
              <Link href="/logout">
                <a className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" onClick={toggleMenu}>
                  <LogOut className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <span className="text-neutral-800 dark:text-neutral-200">Log Out</span>
                </a>
              </Link>
            </div>
            
            <div className="p-4 mt-auto">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                TravelSwipe v1.0.0
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SideMenu;
