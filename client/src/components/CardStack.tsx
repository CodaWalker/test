import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { AnimatePresence } from "framer-motion";
import CityCard from "./CityCard";

const CardStack = () => {
  const { 
    filteredCities, 
    loadCities, 
    loadRoutes,
    likeCity,
    dislikeCity
  } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Храним направление свайпа для анимации
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);
  
  // Обработчик свайпа - первый этап функционала
  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    
    // Имитируем задержку для анимации
    setTimeout(() => {
      const currentCity = filteredCities[currentIndex];
      
      if (direction === "right") {
        likeCity(currentCity.id);
      } else {
        dislikeCity(currentCity.id);
      }
      
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 300); // Задержка соответствует длительности анимации выхода
  };

  // Простое отображение пустого состояния
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
    <div className="flex-1 flex items-center justify-center px-4 py-2 min-h-[80vh]">
      <div className="relative w-full max-w-md h-[500px] flex justify-center items-center">
        <AnimatePresence mode="wait">
          {currentIndex < filteredCities.length && (
            <CityCard 
              key={filteredCities[currentIndex].id}
              city={filteredCities[currentIndex]} 
              onSwipe={handleSwipe}
            />
          )}
        </AnimatePresence>
        
        {currentIndex >= filteredCities.length && (
          <div className="text-center p-4">
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Все города просмотрены</h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Скоро здесь появятся новые направления для вас.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardStack;