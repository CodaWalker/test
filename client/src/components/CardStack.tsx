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
  // Храним историю свайпов для показа индикаторов
  const [swipeHistory, setSwipeHistory] = useState<Array<{id: number, direction: "left" | "right"}>>([]);

  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);
  
  // Расширенный обработчик свайпа
  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    
    // Добавляем звуковой эффект при свайпе
    const audio = new Audio(
      direction === "right" 
        ? 'https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3' 
        : 'https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3'
    );
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Автозапуск аудио заблокирован браузером:", e));
    
    // Сохраняем историю свайпов
    const currentCity = filteredCities[currentIndex];
    setSwipeHistory(prev => [...prev, {id: currentCity.id, direction}]);
    
    // Имитируем задержку для анимации
    setTimeout(() => {
      if (direction === "right") {
        likeCity(currentCity.id);
      } else {
        dislikeCity(currentCity.id);
      }
      
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 400); // Задержка соответствует длительности анимации выхода
  };

  // Улучшенное отображение пустого состояния
  if (filteredCities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3 dark:text-white">Нет городов для просмотра</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            Попробуйте изменить фильтры или настройки предпочтений, чтобы увидеть больше направлений.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => loadCities()}
          >
            Обновить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 min-h-[80vh]">
      {/* История свайпов */}
      {swipeHistory.length > 0 && (
        <div className="mb-4 flex gap-2">
          {swipeHistory.slice(-5).map((item, index) => (
            <div 
              key={index} 
              className={`w-3 h-3 rounded-full ${
                item.direction === "right" 
                  ? "bg-primary" 
                  : "bg-destructive"
              }`}
              title={`Город ${item.id}: ${item.direction === "right" ? "понравился" : "не понравился"}`}
            />
          ))}
        </div>
      )}
      
      {/* Счетчик оставшихся городов */}
      <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
        {filteredCities.length - currentIndex} {filteredCities.length - currentIndex === 1 ? 'город' : 'городов'} осталось
      </div>
      
      {/* Основной компонент карточки */}
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
        
        {/* Отображение пустого состояния */}
        {currentIndex >= filteredCities.length && (
          <div className="text-center p-8 bg-white dark:bg-neutral-800 rounded-xl shadow-md">
            <div className="text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 dark:text-white">Все города просмотрены</h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Скоро здесь появятся новые направления для путешествий.
            </p>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              onClick={() => {
                // Сбрасываем состояние и перезагружаем города
                setCurrentIndex(0);
                setSwipeHistory([]);
                loadCities();
              }}
            >
              Начать сначала
            </button>
          </div>
        )}
      </div>
      
      {/* Подсказка для свайпа (показывается только если есть города и нет истории свайпов) */}
      {currentIndex < filteredCities.length && swipeHistory.length === 0 && (
        <div className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 flex items-center">
          <span>Свайпните влево или вправо</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CardStack;