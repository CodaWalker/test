import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import { Info, ArrowLeft, Heart, X, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { City, Route, Poi } from "@shared/schema";
import { useVibrate } from "@/hooks/useVibrate";

type CityCardProps = {
  city: City;
  pois: Poi[];
  routes: Route[];
  isActive: boolean;
  onSwipe: (direction: "left" | "right") => void;
  onFavorite: (routeId: number) => void;
  onToggleMapView: () => void;
};

const CityCard = ({
  city,
  pois,
  routes,
  isActive,
  onSwipe,
  onFavorite,
  onToggleMapView,
}: CityCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hoveringRoute, setHoveringRoute] = useState<number | null>(null);
  
  const vibrate = useVibrate();
  
  // Card flip animation with react-spring
  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(1000px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });
  
  // Card swipe animation with framer-motion
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const cardOpacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);
  
  const dragEndHandler = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe("right");
      vibrate(100);
    } else if (info.offset.x < -100) {
      onSwipe("left");
      vibrate(100);
    }
  };
  
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    vibrate(50);
  };
  
  const handleLike = () => {
    vibrate(100);
    onSwipe("right");
  };
  
  const handleDislike = () => {
    vibrate(100);
    onSwipe("left");
  };

  return (
    <motion.div
      className={`w-full max-w-md h-[500px] absolute ${isActive ? "z-10" : "z-0"}`}
      style={{ 
        x, 
        rotate,
        opacity: cardOpacity,
      }}
      drag={isActive && !isFlipped ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={dragEndHandler}
      initial={{ scale: isActive ? 1 : 0.95 }}
      animate={{ 
        scale: isActive ? 1 : 0.95,
        opacity: isActive ? 1 : 0.7,
        y: isActive ? 0 : 10
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full perspective">
        {/* Front of card */}
        <animated.div
          className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-neutral-800"
          style={{
            opacity: opacity.to(o => 1 - o),
            transform,
            rotateY: "0deg",
            backfaceVisibility: "hidden"
          }}
        >
          {/* City Image Section */}
          <div className="relative w-full h-64">
            <img
              src={city.mainImage}
              alt={`${city.name} skyline`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div>
                <h2 className="font-bold text-2xl text-white drop-shadow-md">{city.name}</h2>
                <p className="text-white text-sm opacity-90 drop-shadow-md">{city.country}</p>
              </div>
              <div className="flex gap-1">
                {city.tags.slice(0, 2).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className={`bg-${index === 0 ? 'primary' : 'secondary'} text-white border-0`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Swipe controls on image */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
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
            
            {/* Flip button */}
            <Button
              className="absolute bottom-4 right-4 bg-white/90 dark:bg-neutral-700/90 w-10 h-10 rounded-full shadow-md hover:scale-105 p-0"
              onClick={handleFlipCard}
              size="icon"
            >
              <Info className="text-neutral-600 dark:text-white" size={20} />
            </Button>
          </div>

          {/* Routes Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg dark:text-white">Suggested Routes</h3>
              <Button
                variant="link"
                className="text-xs flex items-center gap-1 text-primary font-medium p-0 h-auto"
                onClick={onToggleMapView}
              >
                Map View
                <span className="ml-1">🗺️</span>
              </Button>
            </div>
            
            {/* Routes List */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
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
                        {routes.filter(r => r.id === route.id)
                          .map(r => city.name)
                          .join(" → ")}
                      </p>
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
                  {hoveringRoute === route.id && (
                    <div className="absolute right-2 top-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="p-1.5 bg-white dark:bg-neutral-800 rounded-full text-xs w-7 h-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFavorite(route.id);
                          vibrate(50);
                        }}
                      >
                        <Heart className="text-primary" size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Removed duplicate swipe buttons */}
        </animated.div>
        
        {/* Back of card (POIs) */}
        <animated.div
          className="absolute w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-neutral-800"
          style={{
            opacity,
            transform: transform.to(t => `${t} rotateY(180deg)`),
            backfaceVisibility: "hidden"
          }}
        >
          <div className="relative p-4 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-xl dark:text-white">{city.name}</h2>
              <Button
                className="bg-white dark:bg-neutral-700 w-10 h-10 rounded-full shadow-md hover:scale-105 p-0"
                onClick={handleFlipCard}
                size="icon"
              >
                <ArrowLeft className="text-neutral-600 dark:text-white" size={20} />
              </Button>
            </div>
            
            <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
              {city.description}
            </div>

            {/* POI Gallery */}
            <h3 className="font-semibold text-lg dark:text-white mb-2">Popular Attractions</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {pois.map(poi => (
                <div key={poi.id} className="relative rounded-lg overflow-hidden shadow-md">
                  <img
                    src={poi.image}
                    alt={poi.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <h4 className="text-white text-sm font-medium truncate">{poi.name}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags Section */}
            <h3 className="font-semibold text-lg dark:text-white mb-2">Experience Tags</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {city.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-opacity-10 text-sm px-3 py-1"
                  style={{ 
                    backgroundColor: `rgba(var(--${getBadgeColor(index)}-rgb), 0.1)`,
                    color: `hsl(var(--${getBadgeColor(index)}))` 
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Local Info Section */}
            <h3 className="font-semibold text-lg dark:text-white mb-2">Местная информация</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-lg">
                <div className="text-neutral-500 dark:text-neutral-400">Погода</div>
                <div className="font-medium dark:text-white flex items-center gap-1">
                  <span role="img" aria-label="Sun">☀️</span>
                  {city.localInfo && 'weather' in city.localInfo ? city.localInfo.weather : ''}
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-lg">
                <div className="text-neutral-500 dark:text-neutral-400">Язык</div>
                <div className="font-medium dark:text-white">
                  {city.localInfo && 'language' in city.localInfo ? city.localInfo.language : ''}
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-lg">
                <div className="text-neutral-500 dark:text-neutral-400">Валюта</div>
                <div className="font-medium dark:text-white">
                  {city.localInfo && 'currency' in city.localInfo ? city.localInfo.currency : ''}
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-lg">
                <div className="text-neutral-500 dark:text-neutral-400">Лучший сезон</div>
                <div className="font-medium dark:text-white">
                  {city.localInfo && 'bestSeason' in city.localInfo ? city.localInfo.bestSeason : ''}
                </div>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </motion.div>
  );
};

// Helper function to get badge color
const getBadgeColor = (index: number): string => {
  const colors = ['primary', 'secondary', 'accent', 'destructive'];
  return colors[index % colors.length];
};

export default CityCard;
