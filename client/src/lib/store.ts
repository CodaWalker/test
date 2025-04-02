import { create } from "zustand";
import { City, Route, Poi } from "@shared/schema";
import { mockCities, mockRoutes, mockPois } from "./cityData";

interface UserFilter {
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
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  preferences: {
    interests: string[];
    budget: {
      min: number;
      max: number;
    };
    duration: {
      min: number;
      max: number;
    };
  };
}

interface AppState {
  // UI States
  isDarkMode: boolean;
  isMenuOpen: boolean;
  isFilterOpen: boolean;
  isMapViewOpen: boolean;
  
  // App Data
  currentTab: string;
  cities: City[];
  filteredCities: City[];
  routes: Route[];
  pois: Poi[];
  likedCities: number[];
  dislikedCities: number[];
  favorites: number[];
  currentFilters: UserFilter;
  userProfile: UserProfile | null;
  
  // UI Actions
  toggleDarkMode: () => void;
  toggleMenu: () => void;
  toggleFilter: () => void;
  toggleMapView: () => void;
  setCurrentTab: (tab: string) => void;
  
  // Data Actions
  loadCities: () => Promise<void>;
  loadRoutes: () => Promise<void>;
  loadPoisForCity: (cityId: number) => Promise<void>;
  updateFilters: (filters: Partial<UserFilter>) => void;
  likeCity: (cityId: number) => void;
  dislikeCity: (cityId: number) => void;
  addToFavorites: (routeId: number) => void;
  removeFromFavorites: (routeId: number) => void;
  updateUserProfile: (user: Partial<UserProfile>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // UI States
  isDarkMode: localStorage.getItem("theme") === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
  isMenuOpen: false,
  isFilterOpen: false,
  isMapViewOpen: false,
  
  // App Data
  currentTab: "explore",
  cities: [],
  filteredCities: [],
  routes: [],
  pois: [],
  likedCities: [],
  dislikedCities: [],
  favorites: [],
  currentFilters: {
    interests: ["Beach", "Culture"],
    dates: { start: null, end: null },
    budget: { min: 500, max: 2000 },
    duration: { min: 3, max: 10 }
  },
  userProfile: {
    id: 1,
    username: "user",
    email: "user@example.com",
    preferences: {
      interests: ["Beach", "Culture", "Food"],
      budget: { min: 500, max: 2000 },
      duration: { min: 3, max: 10 }
    }
  },
  
  // UI Actions
  toggleDarkMode: () => {
    const isDark = !get().isDarkMode;
    set({ isDarkMode: isDark });
    localStorage.setItem("theme", isDark ? "dark" : "light");
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
  
  toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
  toggleFilter: () => set(state => ({ isFilterOpen: !state.isFilterOpen })),
  toggleMapView: () => set(state => ({ isMapViewOpen: !state.isMapViewOpen })),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  // Data Actions
  loadCities: async () => {
    try {
      // In a real app, this would be a fetch call to the API
      // const response = await fetch("/api/cities");
      // const data = await response.json();
      const data = mockCities;
      
      set({ 
        cities: data,
        filteredCities: data.filter(city => {
          const { interests } = get().currentFilters;
          return city.tags.some(tag => interests.includes(tag));
        })
      });
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  },
  
  loadRoutes: async () => {
    try {
      // In a real app, this would be a fetch call to the API
      // const response = await fetch("/api/routes");
      // const data = await response.json();
      const data = mockRoutes;
      set({ routes: data });
    } catch (error) {
      console.error("Failed to load routes:", error);
    }
  },
  
  loadPoisForCity: async (cityId) => {
    try {
      // In a real app, this would be a fetch call to the API
      // const response = await fetch(`/api/cities/${cityId}/pois`);
      // const data = await response.json();
      const data = mockPois.filter(poi => poi.cityId === cityId);
      set({ pois: data });
    } catch (error) {
      console.error(`Failed to load POIs for city ${cityId}:`, error);
    }
  },
  
  updateFilters: (filters) => {
    const newFilters = { ...get().currentFilters, ...filters };
    set({ 
      currentFilters: newFilters,
      filteredCities: get().cities.filter(city => {
        const { interests } = newFilters;
        return city.tags.some(tag => interests.includes(tag));
      })
    });
  },
  
  likeCity: (cityId) => {
    set(state => ({ 
      likedCities: [...state.likedCities, cityId],
      filteredCities: state.filteredCities.filter(city => city.id !== cityId)
    }));
  },
  
  dislikeCity: (cityId) => {
    set(state => ({ 
      dislikedCities: [...state.dislikedCities, cityId],
      filteredCities: state.filteredCities.filter(city => city.id !== cityId)
    }));
  },
  
  addToFavorites: (routeId) => {
    set(state => ({ 
      favorites: [...state.favorites, routeId] 
    }));
  },
  
  removeFromFavorites: (routeId) => {
    set(state => ({ 
      favorites: state.favorites.filter(id => id !== routeId) 
    }));
  },
  
  updateUserProfile: (user) => {
    set(state => ({ 
      userProfile: state.userProfile ? { ...state.userProfile, ...user } : null 
    }));
  }
}));
