import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import CardStack from "@/components/CardStack";

const Explore = () => {
  const {
    loadCities,
    loadRoutes,
    loadPoisForCity
  } = useStore();

  const [selectedCityId] = useState<number | null>(null);

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

  return (
    <>
      <div className="flex-1 flex flex-col">
        <CardStack />
      </div>
    </>
  );
};

export default Explore;
