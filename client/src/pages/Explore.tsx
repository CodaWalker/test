import { useEffect } from "react";
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
    currentFilters,
    updateFilters,
    loadCities,
    loadRoutes,
    toggleMapView,
    toggleFilter,
    addToFavorites
  } = useStore();
  
  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);
  
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
        onClose={toggleMapView}
        onSelectRoute={addToFavorites}
        onSelectCity={() => {}}
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
