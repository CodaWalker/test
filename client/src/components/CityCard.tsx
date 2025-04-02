import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { City, Poi } from "@shared/schema";
import { Heart, X, Map, Image, MapPin, Info, ZoomIn, ZoomOut, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVibrate } from "@/hooks/useVibrate";
import { useStore } from "@/lib/store";

type CityCardProps = {
  city: City;
  onSwipe?: (direction: "left" | "right") => void;
};

const CityCard = ({ city, onSwipe }: CityCardProps) => {
  const vibrate = useVibrate();
  const { loadPoisForCity, pois } = useStore();
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cityPois, setCityPois] = useState<Poi[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapStyle, setMapStyle] = useState<"default" | "satellite" | "terrain">("default");
  
  // Используем доступный массив дополнительных фотографий из городов
  const images = [city.mainImage, ...(city.additionalImages || [])];
  
  // Значения для анимации Tinder
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const animControls = useRef(null);
  
  // Загружаем POI для города при первом рендере
  useEffect(() => {
    const fetchPois = async () => {
      try {
        await loadPoisForCity(city.id);
      } catch (error) {
        console.error("Ошибка при загрузке POI:", error);
      }
    };
    
    fetchPois();
  }, [city.id, loadPoisForCity]);
  
  // Фильтруем POI, соответствующие тегам города
  useEffect(() => {
    if (pois.length > 0) {
      const filteredPois = pois.filter(poi => 
        poi.cityId === city.id && 
        // Проверяем, соответствуют ли теги POI тегам города
        poi.tags.some(tag => city.tags.includes(tag))
      );
      setCityPois(filteredPois);
    }
  }, [pois, city.id, city.tags]);
  
  const handleLike = () => {
    vibrate(50);
    setSwipeDirection("right");
    if (onSwipe) {
      setTimeout(() => onSwipe("right"), 100);
    }
  };
  
  const handleDislike = () => {
    vibrate(30);
    setSwipeDirection("left");
    if (onSwipe) {
      setTimeout(() => onSwipe("left"), 100);
    }
  };
  
  const toggleMap = () => {
    vibrate(15);
    setShowMap(prev => !prev);
    setSelectedPoi(null); // Сбрасываем выбранную POI при переключении
  };
  
  const nextImage = () => {
    vibrate(10);
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    vibrate(10);
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
  };
  
  const handlePoiClick = (poi: Poi) => {
    vibrate(10);
    setSelectedPoi(poi);
  };

  return (
    <motion.div
      className="w-full max-w-md h-[500px] absolute"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
      exit={{ 
        x: swipeDirection === "left" ? -500 : 500, 
        rotateZ: swipeDirection === "left" ? -20 : 20,
        opacity: 0,
        scale: 0.9,
        transition: { 
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      transition={{ duration: 0.3 }}
      style={{ x, rotate }}
      drag={!showMap ? "x" : false} // Активируем перетаскивание только когда не показана карта
      dragConstraints={{ left: 0, right: 0 }} // Возвращаемся в центр при отпускании
      dragElastic={0.7} // Эластичность перетаскивания
      onDragEnd={(e, { offset, velocity }) => {
        // Определяем достаточно ли далеко перетащили для свайпа
        const swipeThreshold = 100;
        const swipe = offset.x;
        if (swipe < -swipeThreshold) {
          setSwipeDirection("left");
          handleDislike();
        } else if (swipe > swipeThreshold) {
          setSwipeDirection("right");
          handleLike();
        }
      }}
    >
      <div className="w-full h-full rounded-2xl bg-white dark:bg-neutral-800 flex flex-col shadow-lg overflow-hidden">
        {/* Image/Map Section */}
        <div className="relative w-full h-64">
          {!showMap ? (
            <div className="relative w-full h-full">
              <img
                src={images[currentImageIndex]}
                alt={city.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image navigation controls */}
              {images.length > 1 && (
                <>
                  <button 
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-neutral-800/70 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-neutral-800/70 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                  
                  {/* Image dots indicator */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                    {images.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full h-full relative bg-neutral-100 dark:bg-neutral-700">
              {cityPois.length > 0 ? (
                // Фейковая карта с точками POI
                <div className="w-full h-full relative p-2">
                  {/* Центр города */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  
                  {/* POI маркеры, размещенные псевдослучайно вокруг центра */}
                  {cityPois.map((poi, index) => {
                    // Для обеспечения стабильности позиций при перерисовке используем фиксированное значение для каждого POI
                    // Используем ID как seed для генерации псевдослучайной, но стабильной позиции
                    const poiId = poi.id;
                    const seed = poiId * 10000 + index;
                    const pseudoRandom = Math.sin(seed) * 0.5 + 0.5; // Значение от 0 до 1
                    
                    // Распределяем POI по кругу с использованием "детерминированного" случайного смещения
                    const angle = (index / cityPois.length) * Math.PI * 2;
                    const baseDistance = 20; // Базовое расстояние от центра
                    const randomOffset = pseudoRandom * 15; // Случайное смещение
                    const distance = baseDistance + randomOffset;
                    
                    // Рассчитываем позицию с учетом масштаба карты
                    const scaleFactor = 1 / mapZoom; // Обратная зависимость для эффекта масштабирования
                    const left = 50 + Math.cos(angle) * distance * scaleFactor;
                    const top = 50 + Math.sin(angle) * distance * scaleFactor;
                    
                    const tagMatches = poi.tags.some(tag => city.tags.includes(tag));
                    
                    return (
                      <motion.div
                        key={poi.id}
                        className={`absolute w-8 h-8 -ml-4 -mt-4 cursor-pointer transition-all duration-300 ${selectedPoi?.id === poi.id ? 'scale-125 z-40' : 'hover:scale-110 z-30'}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ 
                          opacity: 1, 
                          scale: selectedPoi?.id === poi.id ? 1.25 : 1,
                          x: 0, y: 0,
                          left: `${left}%`, 
                          top: `${top}%` 
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20,
                          delay: index * 0.05 // Последовательное появление точек
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePoiClick(poi)}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            selectedPoi?.id === poi.id 
                              ? 'bg-primary scale-110 shadow-glow' 
                              : tagMatches 
                                ? 'bg-primary/90' 
                                : 'bg-primary/70'
                          }`}></div>
                        </div>
                        
                        {/* Название POI */}
                        <AnimatePresence>
                          {(selectedPoi?.id === poi.id || tagMatches) && (
                            <motion.div 
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap z-10"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                            >
                              <div className={`px-2 py-1 rounded-md text-xs font-medium shadow-md
                                ${selectedPoi?.id === poi.id 
                                  ? 'bg-primary text-white' 
                                  : 'bg-white/90 dark:bg-neutral-800/90'}
                              `}>
                                {poi.name}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                  
                  {/* Легенда карты */}
                  <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-neutral-800/80 px-2 py-1 rounded-md">
                    <div className="flex items-center text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary mr-1"></div>
                      <span>Достопримечательности ({cityPois.length})</span>
                    </div>
                  </div>
                  
                  {/* Кнопка-подсказка для выбора POI */}
                  {!selectedPoi && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-neutral-800/90 py-2 px-4 rounded-full shadow-md">
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 flex items-center">
                        <span className="mr-1">Нажмите на точку для просмотра</span>
                        <Info size={12} className="text-primary" />
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex flex-col items-center text-center px-4">
                    <MapPin className="text-primary mb-2" size={24} />
                    <p className="text-sm dark:text-white">Загрузка достопримечательностей...</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Для города "{city.name}" будут показаны места, связанные с вашими интересами
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Фон карты с различными стилями */}
          {showMap && (
            <div 
              className="absolute inset-0 z-5 overflow-hidden"
            >
              {/* Симуляция карты с разными стилями */}
              <div 
                className="absolute inset-0 transition-all duration-300"
                style={{ 
                  backgroundImage: 
                    mapStyle === "default" 
                      ? `url('https://images.pexels.com/photos/4215110/pexels-photo-4215110.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')` 
                      : mapStyle === "satellite" 
                        ? `url('https://images.pexels.com/photos/3760564/pexels-photo-3760564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')`
                        : `url('https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.5,
                  transform: `scale(${mapZoom})`,
                  filter: `brightness(${mapZoom * 0.2 + 0.8}) contrast(${mapZoom * 0.3 + 0.7})`,
                  backgroundColor: mapStyle === "default" ? "#f5f5f5" : mapStyle === "satellite" ? "#373237" : "#e9eee9"
                }}
              />
              
              {/* Стилизация карты в соответствии с выбранным стилем */}
              <div className="absolute inset-0" style={{ 
                opacity: 0.3, 
                backgroundSize: `${20 * mapZoom}px ${20 * mapZoom}px`,
                backgroundPosition: "center",
                backgroundImage: mapStyle === "default" 
                  ? `linear-gradient(to right, #ccc 1px, transparent 1px), 
                     linear-gradient(to bottom, #ccc 1px, transparent 1px)`
                  : mapStyle === "satellite" ? "none" : `
                     radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 20%, transparent 30%)`
              }}></div>
            </div>
          )}
          
          {/* Градиент для фото. В режиме карты показываем только верхнюю часть */}
          <div className={`absolute top-0 left-0 w-full ${showMap ? 'h-20' : 'h-full'} bg-gradient-to-b from-black/50 to-transparent z-10`}></div>
          
          {/* Header with city info and tags */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2 z-20">
            <div>
              <h2 className="font-bold text-2xl text-white drop-shadow-md">{city.name}</h2>
              <p className="text-white text-sm opacity-90 drop-shadow-md">{city.country}</p>
            </div>
            
            {/* Теги с анимированным переходом в зависимости от режима просмотра */}
            <AnimatePresence mode="wait">
              {!showMap ? (
                <motion.div 
                  key="tags-regular"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap gap-1 mt-2 pr-16"
                >
                  {city.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="bg-primary text-white border-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="tags-map"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-4 right-4 flex flex-wrap gap-1 justify-end"
                  style={{ 
                    left: "auto", 
                    width: "auto", 
                    zIndex: 40 // Повышаем z-index, чтобы теги были видны
                  }}
                >
                  {city.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline"
                      className="bg-primary/80 backdrop-blur-sm text-white border-0 shadow-md"
                    >
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Элементы управления картой (показываются только в режиме карты) */}
          {showMap && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
              <Button
                size="icon"
                variant="secondary"
                className="w-9 h-9 rounded-full shadow-md bg-white/90 dark:bg-neutral-700/90 hover:scale-105 transition-transform"
                onClick={() => setMapZoom(Math.min(mapZoom + 0.2, 2))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="w-9 h-9 rounded-full shadow-md bg-white/90 dark:bg-neutral-700/90 hover:scale-105 transition-transform"
                onClick={() => setMapZoom(Math.max(mapZoom - 0.2, 0.6))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="w-9 h-9 rounded-full shadow-md bg-white/90 dark:bg-neutral-700/90 hover:scale-105 transition-transform"
                onClick={() => {
                  setMapStyle(prev => {
                    if (prev === "default") return "satellite";
                    if (prev === "satellite") return "terrain";
                    return "default";
                  });
                }}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Toggle Map/Images button - перемещен вниз справа и повышен z-index */}
          <div className="absolute bottom-4 right-4" style={{ zIndex: 50 }}>
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 rounded-full shadow-md p-0 bg-white/90 dark:bg-neutral-700/90 hover:scale-105 transition-transform"
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                toggleMap();
              }}
            >
              {showMap ? <Image className="h-6 w-6" /> : <Map className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Swipe controls on image - показываем только если не карта */}
          {!showMap && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 z-20">
              <Button
                size="icon"
                className="bg-white/90 dark:bg-neutral-700/90 w-14 h-14 rounded-full shadow-md hover:scale-105 p-0 transition-transform"
                onClick={handleDislike}
              >
                <X className="text-destructive" size={28} />
              </Button>
              <Button
                size="icon"
                className="bg-white/90 dark:bg-neutral-700/90 w-14 h-14 rounded-full shadow-md hover:scale-105 p-0 transition-transform"
                onClick={handleLike}
              >
                <Heart className="text-primary" size={28} />
              </Button>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-4 flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {/* Содержимое будет зависеть от выбора POI и режима карты */}
            {showMap && selectedPoi ? (
              // Показываем информацию о выбранном POI
              <motion.div
                key="poi-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="relative"
              >
                <div className="flex items-center mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2 text-primary p-0 h-8 w-8"
                    onClick={() => setSelectedPoi(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                  </Button>
                  <h3 className="font-semibold text-lg dark:text-white">
                    {selectedPoi.name}
                  </h3>
                </div>
                
                <div className="flex items-center mb-2">
                  <MapPin className="text-primary mr-1" size={16} />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Достопримечательность в городе {city.name}
                  </p>
                </div>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                  {selectedPoi.description}
                </p>
                
                {/* Категории/теги POI */}
                <div className="mb-3">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Категории:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedPoi.tags.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Дополнительная информация */}
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-md">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Рекомендации:</p>
                  <ul className="text-sm text-neutral-600 dark:text-neutral-300 pl-5 list-disc">
                    <li>Лучшее время для посещения: {city.localInfo?.bestSeason || "Любое время года"}</li>
                    <li>Примерное время на осмотр: 1-2 часа</li>
                    <li>Средняя стоимость билета: от 300₽</li>
                  </ul>
                </div>
              </motion.div>
            ) : (
              // Стандартное описание города
              <motion.div
                key="city-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <h3 className="font-semibold text-lg dark:text-white mb-2">Описание</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {city.description}
                </p>
                
                {/* Информация о погоде и прочем */}
                {city.localInfo && (
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-neutral-500 dark:text-neutral-400">Погода:</div>
                      <div className="font-medium">{city.localInfo.weather}</div>
                      <div className="text-neutral-500 dark:text-neutral-400">Язык:</div>
                      <div className="font-medium">{city.localInfo.language}</div>
                      <div className="text-neutral-500 dark:text-neutral-400">Валюта:</div>
                      <div className="font-medium">{city.localInfo.currency}</div>
                      <div className="text-neutral-500 dark:text-neutral-400">Лучший сезон:</div>
                      <div className="font-medium">{city.localInfo.bestSeason}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CityCard;