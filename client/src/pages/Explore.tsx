import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import CardStack from "@/components/CardStack";
import MapView from "@/components/MapView";
import SideMenu from "@/components/SideMenu";
import FilterModal from "@/components/FilterModal";

const Explore = () => {
  const { 
    isMapViewOpen, 
    isFilterOpen, 
    cities,
    routes,
    pois,
    currentFilters,
    updateFilters,
    loadCities,
    loadRoutes,
    loadPoisForCity,
    toggleMapView,
    toggleFilter,
    addToFavorites,
    showPOIsOnMap,
    togglePOIsOnMap
  } = useStore();
  
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  
  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);
  
  // Загружаем POI для выбранного города
  useEffect(() => {
    if (selectedCityId) {
      loadPoisForCity(selectedCityId);
    }
  }, [selectedCityId, loadPoisForCity]);
  
  // Обработчик для выбора города и загрузки его POI
  const handleSelectCity = (cityId: number) => {
    setSelectedCityId(cityId);
    loadPoisForCity(cityId);
  };
  
  const handleFilterReset = () => {
    updateFilters({
      interests: ["Beach", "Culture"],
      dates: { start: null, end: null },
      budget: { min: 500, max: 2000 },
      duration: { min: 3, max: 10 }
    });
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <CardStack />
      </div>
      
      <MapView 
        isOpen={isMapViewOpen}
        cities={cities}
        routes={routes}
        pois={pois}
        onClose={toggleMapView}
        onSelectRoute={addToFavorites}
        onSelectCity={handleSelectCity}
        showPOIs={showPOIsOnMap}
        onTogglePOIs={togglePOIsOnMap}
      />
      
      <FilterModal 
        isOpen={isFilterOpen}
        filters={currentFilters}
        onClose={toggleFilter}
        onApply={updateFilters}
        onReset={handleFilterReset}
      />
      
      <SideMenu />
    </>
  );
};

export default Explore;
