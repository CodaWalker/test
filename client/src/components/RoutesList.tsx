import { useState } from "react";
import { format } from "date-fns";
import { Heart, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { City, Route } from "@shared/schema";
import { useVibrate } from "@/hooks/useVibrate";

interface RoutesListProps {
  routes: Route[];
  cities: City[];
  currentCityId?: number;
  onAddToFavorites: (routeId: number) => void;
  onToggleMapView: () => void;
  showMapButton?: boolean;
  favorites?: number[];
  onRemoveFromFavorites?: (routeId: number) => void;
}

const RoutesList = ({
  routes,
  cities,
  currentCityId,
  onAddToFavorites,
  onToggleMapView,
  showMapButton = true,
  favorites = [],
  onRemoveFromFavorites
}: RoutesListProps) => {
  const [hoveringRoute, setHoveringRoute] = useState<number | null>(null);
  const vibrate = useVibrate();

  // Helper to get city names for a route
  const getCityNames = (cityIds: number[]): string => {
    return cityIds
      .map(id => cities.find(city => city.id === id)?.name || "")
      .filter(Boolean)
      .join(" → ");
  };

  // Check if a route is favorited
  const isFavorite = (routeId: number): boolean => {
    return favorites.includes(routeId);
  };

  // Handle favoriting or unfavoriting a route
  const handleFavoriteToggle = (routeId: number) => {
    vibrate(50);
    if (isFavorite(routeId) && onRemoveFromFavorites) {
      onRemoveFromFavorites(routeId);
    } else {
      onAddToFavorites(routeId);
    }
  };

  if (routes.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
        <p>No routes available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {showMapButton && (
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg dark:text-white">
            {currentCityId ? "Suggested Routes" : "Available Routes"}
          </h3>
          <Button
            variant="link"
            className="text-xs flex items-center gap-1 text-primary font-medium p-0 h-auto"
            onClick={onToggleMapView}
          >
            Map View
            <Map className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {routes.map((route) => (
          <div
            key={route.id}
            className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 transition hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer relative"
            onMouseEnter={() => setHoveringRoute(route.id)}
            onMouseLeave={() => setHoveringRoute(null)}
          >
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: route.color }}
                  ></span>
                  <h4 className="font-medium text-sm dark:text-white">{route.name}</h4>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
                  {getCityNames(route.cities)}
                </p>
                {currentCityId && route.cities.includes(currentCityId) && (
                  <Badge 
                    variant="outline" 
                    className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs"
                  >
                    Includes current city
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                  {format(new Date(route.startDate), "MMM d")} - {format(new Date(route.endDate), "MMM d")}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  ${route.price}
                </p>
              </div>
            </div>
            
            {(hoveringRoute === route.id || isFavorite(route.id)) && (
              <div className="absolute right-2 top-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="p-1.5 bg-white dark:bg-neutral-800 rounded-full text-xs w-7 h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(route.id);
                  }}
                >
                  <Heart 
                    className={isFavorite(route.id) ? "text-primary fill-primary" : "text-primary"} 
                    size={14} 
                  />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesList;
