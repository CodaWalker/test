import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import CityCard from "./CityCard";
import { AnimatePresence } from "framer-motion";

const CardStack = () => {
  const { 
    filteredCities, 
    routes, 
    pois,
    likeCity, 
    dislikeCity, 
    loadCities, 
    loadRoutes, 
    loadPoisForCity,
    addToFavorites,
    toggleMapView
  } = useStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedPois, setLoadedPois] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);

  useEffect(() => {
    if (filteredCities.length > 0 && !loadedPois[filteredCities[currentIndex]?.id]) {
      const cityId = filteredCities[currentIndex]?.id;
      if (cityId) {
        loadPoisForCity(cityId);
        setLoadedPois(prev => ({ ...prev, [cityId]: true }));
      }
    }
  }, [currentIndex, filteredCities, loadedPois, loadPoisForCity]);

  const handleSwipe = (direction: "left" | "right") => {
    const currentCity = filteredCities[currentIndex];
    
    if (direction === "right") {
      likeCity(currentCity.id);
    } else {
      dislikeCity(currentCity.id);
    }
    
    // Load the next city's POIs in advance
    if (currentIndex + 1 < filteredCities.length) {
      const nextCityId = filteredCities[currentIndex + 1].id;
      if (!loadedPois[nextCityId]) {
        loadPoisForCity(nextCityId);
        setLoadedPois(prev => ({ ...prev, [nextCityId]: true }));
      }
    }
    
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  // Get city-specific routes
  const getRoutesForCity = (cityId: number) => {
    return routes.filter(route => route.cities.includes(cityId));
  };

  // Get POIs for current city
  const getPoisForCity = (cityId: number) => {
    return pois.filter(poi => poi.cityId === cityId);
  };

  if (filteredCities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-4 max-w-md">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Нет городов для просмотра</h3>
          <p className="text-neutral-600 dark:text-neutral-300">
            Попробуйте изменить фильтры или настройки предпочтений, чтобы увидеть больше направлений.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-2">
      <div className="relative w-full max-w-md mx-auto flex justify-center items-center">
        <AnimatePresence>
          {filteredCities.map((city, index) => {
            // Only render the current card
            if (index !== currentIndex) return null;
            
            const cityRoutes = getRoutesForCity(city.id);
            const cityPois = getPoisForCity(city.id);
            
            return (
              <CityCard
                key={city.id}
                city={city}
                pois={cityPois}
                routes={cityRoutes}
                isActive={true}
                onSwipe={handleSwipe}
                onFavorite={addToFavorites}
                onToggleMapView={toggleMapView}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CardStack;
