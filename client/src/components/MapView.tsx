import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
// import ReactMapGL, { Marker, Source, Layer, Popup } from "react-map-gl";
import { X, MapPin, Info, Heart, Map, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { City, Route, Poi } from "@shared/schema";
import { format } from "date-fns";

interface MapViewProps {
  isOpen: boolean;
  cities: City[];
  routes: Route[];
  pois?: Poi[];
  onClose: () => void;
  onSelectRoute: (routeId: number) => void;
  onSelectCity: (cityId: number) => void;
  showPOIs?: boolean;
  onTogglePOIs?: () => void;
}

const MapView = ({ 
  isOpen, 
  cities, 
  routes, 
  pois = [], 
  onClose, 
  onSelectRoute, 
  onSelectCity, 
  showPOIs = false,
  onTogglePOIs
}: MapViewProps) => {
  const [viewport, setViewport] = useState({
    latitude: 41.3851,
    longitude: 2.1734,
    zoom: 2
  });
  
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<number | null>(null);
  
  // Reset selections when closing
  useEffect(() => {
    if (!isOpen) {
      setSelectedCity(null);
      setSelectedRoute(null);
      setSelectedPoi(null);
      setHoveredRoute(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-white dark:bg-neutral-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
              <h3 className="font-semibold text-lg dark:text-white">
                {showPOIs ? "Достопримечательности" : "Маршруты путешествий"}
              </h3>
              <div className="flex items-center gap-2">
                {onTogglePOIs && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onTogglePOIs}
                    className="flex items-center gap-1"
                  >
                    {showPOIs ? (
                      <>
                        <Map className="h-4 w-4" />
                        <span className="text-xs">Маршруты</span>
                      </>
                    ) : (
                      <>
                        <Landmark className="h-4 w-4" />
                        <span className="text-xs">Места</span>
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  <X className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
                </Button>
              </div>
            </div>
            
            <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-900 flex flex-col justify-center items-center">
              <div className="text-center p-8 max-w-md">
                <h3 className="text-xl font-semibold mb-4">Интерактивная карта временно недоступна</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Мы работаем над установкой необходимых компонентов для отображения карты.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Список городов */}
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md">
                    <h4 className="font-medium mb-2">Города на маршруте</h4>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cities.slice(0, 5).map(city => (
                        <li 
                          key={city.id} 
                          className="py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 rounded px-2"
                          onClick={() => onSelectCity(city.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCityColor(city.id, routes) }}></div>
                            <span>{city.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Список маршрутов или POI */}
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md">
                    <h4 className="font-medium mb-2">{showPOIs ? "Популярные места" : "Маршруты"}</h4>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {showPOIs 
                        ? pois.slice(0, 5).map(poi => (
                            <li 
                              key={poi.id} 
                              className="py-2 flex items-center gap-2"
                            >
                              <MapPin className="text-primary" size={14} />
                              <span className="text-sm">{poi.name}</span>
                            </li>
                          ))
                        : routes.slice(0, 5).map(route => (
                            <li 
                              key={route.id} 
                              className="py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 rounded px-2"
                              onClick={() => onSelectRoute(route.id)}
                            >
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: route.color }}
                                ></div>
                                <span className="text-sm">{route.name}</span>
                              </div>
                            </li>
                          ))
                      }
                    </ul>
                  </div>
                </div>
                <Button onClick={onClose} variant="outline">
                  Закрыть карту
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Helper function to get a color for a city based on its routes
function getCityColor(cityId: number, routes: Route[]): string {
  const route = routes.find(r => r.cities.includes(cityId));
  return route?.color || "#888888";
}

// Helper function to get center of a route for popup
function getCenterOfRoute(routeId: number, routes: Route[], cities: City[]) {
  const route = routes.find(r => r.id === routeId);
  if (!route || route.cities.length === 0) return { lat: 0, lng: 0 };
  
  const routeCities = cities.filter(city => route.cities.includes(city.id));
  const lats = routeCities.map(city => city.coordinates.lat);
  const lngs = routeCities.map(city => city.coordinates.lng);
  
  const centerLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
  const centerLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
  
  return { lat: centerLat, lng: centerLng };
}

export default MapView;
