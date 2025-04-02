import { City, Route, Poi } from "@shared/schema";

export interface CityCardProps {
  city: City;
  pois: Poi[];
  routes: Route[];
  isActive: boolean;
  onSwipe: (direction: "left" | "right") => void;
  onFlip: () => void;
}

export interface CardStackProps {
  cities: City[];
  onSwipe: (cityId: number, direction: "left" | "right") => void;
}

export interface RoutesListProps {
  routes: Route[];
  currentCityId: number;
  onAddToFavorites: (routeId: number) => void;
  onToggleMapView: () => void;
}

export interface MapViewProps {
  isOpen: boolean;
  routes: Route[];
  cities: City[];
  onClose: () => void;
  onSelectRoute: (routeId: number) => void;
  onSelectCity: (cityId: number) => void;
}

export interface FilterModalProps {
  isOpen: boolean;
  filters: {
    interests: string[];
    dates: {
      start: Date | null;
      end: Date | null;
    };
    budget: {
      min: number;
      max: number;
    };
    duration: {
      min: number;
      max: number;
    };
  };
  onClose: () => void;
  onApply: (filters: FilterModalProps["filters"]) => void;
  onReset: () => void;
}

export interface SideMenuProps {
  isOpen: boolean;
  user: {
    name: string;
    email: string;
  };
  onClose: () => void;
}

export interface HeaderProps {
  onMenuToggle: () => void;
  onFilterToggle: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export interface BottomNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export interface POIItemProps {
  poi: Poi;
}

export interface RouteItemProps {
  route: Route;
  isCurrentCity: boolean;
  onAddToFavorites: (routeId: number) => void;
}

export interface UserPreferences {
  interests: string[];
  budget: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
}
