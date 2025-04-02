import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { City } from "@shared/schema";
import { Heart, X, Map, Image, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVibrate } from "@/hooks/useVibrate";

type CityCardProps = {
  city: City;
  onSwipe?: (direction: "left" | "right") => void;
};

const CityCard = ({ city, onSwipe }: CityCardProps) => {
  const vibrate = useVibrate();
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Используем доступный массив дополнительных фотографий из городов
  const images = [city.mainImage, ...(city.additionalImages || [])];
  
  // Значения для анимации Tinder
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const animControls = useRef(null);
  
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
  };
  
  const nextImage = () => {
    vibrate(10);
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };
  
  const prevImage = () => {
    vibrate(10);
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
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
            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <MapPin className="text-primary mb-2" size={24} />
                <p className="text-sm dark:text-white">Карта с достопримечательностями</p>
              </div>
            </div>
          )}
          
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent z-0"></div>
          
          {/* Header with city info and tags */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2 z-20">
            <div>
              <h2 className="font-bold text-2xl text-white drop-shadow-md">{city.name}</h2>
              <p className="text-white text-sm opacity-90 drop-shadow-md">{city.country}</p>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2 pr-16">
              {city.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-primary text-white border-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Toggle Map/Images button - перемещен вниз справа */}
          <div className="absolute bottom-4 right-4 z-20">
            <Button
              size="icon"
              variant="secondary"
              className="w-12 h-12 rounded-full shadow-md p-0 bg-white/90 dark:bg-neutral-700/90"
              onClick={toggleMap}
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
        <div className="p-4 flex-1">
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
        </div>
      </div>
    </motion.div>
  );
};

export default CityCard;