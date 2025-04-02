import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMapGL, { Marker, Source, Layer, Popup } from "react-map-gl";
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
            
            <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-900">
              <ReactMapGL
                {...viewport}
                width="100%"
                height="100%"
                mapStyle="mapbox://styles/mapbox/light-v10"
                onViewportChange={setViewport}
                mapboxApiAccessToken={process.env.MAPBOX_TOKEN || "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2t6Ymx1bjl4MDZxYzJ1bzJ3MjFvNDYwNyJ9.W6pWbRzOz-2RxYEFAKT99g"}
              >
                {/* Draw routes */}
                {routes.map(route => {
                  const routeCities = cities.filter(city => route.cities.includes(city.id));
                  const routeCoordinates = routeCities.map(city => [city.coordinates.lng, city.coordinates.lat]);
                  
                  if (routeCoordinates.length < 2) return null;
                  
                  const geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: routeCoordinates
                    }
                  };
                  
                  const isHighlighted = hoveredRoute === route.id || selectedRoute === route.id;
                  
                  return (
                    <Source
                      key={route.id}
                      id={`route-${route.id}`}
                      type="geojson"
                      data={geojson as any}
                    >
                      <Layer
                        id={`route-layer-${route.id}`}
                        type="line"
                        paint={{
                          'line-color': route.color,
                          'line-width': isHighlighted ? 4 : 2,
                          'line-opacity': isHighlighted ? 1 : 0.6
                        }}
                        onClick={() => {
                          setSelectedRoute(route.id);
                          onSelectRoute(route.id);
                        }}
                        onMouseEnter={() => setHoveredRoute(route.id)}
                        onMouseLeave={() => setHoveredRoute(null)}
                      />
                    </Source>
                  );
                })}
                
                {/* Draw city markers */}
                {cities.map(city => (
                  <Marker
                    key={city.id}
                    latitude={city.coordinates.lat}
                    longitude={city.coordinates.lng}
                    offsetLeft={-15}
                    offsetTop={-30}
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        setSelectedCity(city.id);
                        onSelectCity(city.id);
                      }}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full ${selectedCity === city.id ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: getCityColor(city.id, routes) }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-700 px-2 py-1 rounded text-xs font-medium shadow-md whitespace-nowrap">
                        {city.name}
                      </div>
                    </div>
                  </Marker>
                ))}
                
                {/* City Popup */}
                {selectedCity && (
                  <Popup
                    latitude={cities.find(c => c.id === selectedCity)!.coordinates.lat}
                    longitude={cities.find(c => c.id === selectedCity)!.coordinates.lng}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setSelectedCity(null)}
                    anchor="bottom"
                  >
                    <div className="p-2 w-48">
                      <h4 className="font-medium text-sm mb-1">
                        {cities.find(c => c.id === selectedCity)?.name}, 
                        {cities.find(c => c.id === selectedCity)?.country}
                      </h4>
                      <p className="text-neutral-500 text-xs mb-1">
                        В {routes.filter(r => r.cities.includes(selectedCity)).length} маршрутах
                      </p>
                      <Button
                        className="w-full bg-primary text-white rounded py-1 text-xs font-medium mt-1"
                        size="sm"
                        onClick={() => {
                          onSelectCity(selectedCity);
                          onClose();
                        }}
                      >
                        Подробнее
                      </Button>
                    </div>
                  </Popup>
                )}
                
                {/* Route Popup */}
                {selectedRoute && (
                  <Popup
                    latitude={getCenterOfRoute(selectedRoute, routes, cities).lat}
                    longitude={getCenterOfRoute(selectedRoute, routes, cities).lng}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setSelectedRoute(null)}
                    anchor="bottom"
                  >
                    <div className="p-2 w-48">
                      <h4 className="font-medium text-sm mb-1">
                        {routes.find(r => r.id === selectedRoute)?.name}
                      </h4>
                      <p className="text-neutral-500 text-xs mb-1">
                        {cities
                          .filter(city => routes.find(r => r.id === selectedRoute)?.cities.includes(city.id))
                          .map(city => city.name)
                          .join(" → ")}
                      </p>
                      <p className="text-neutral-500 text-xs">
                        {format(new Date(routes.find(r => r.id === selectedRoute)!.startDate), "MMM d")} - 
                        {format(new Date(routes.find(r => r.id === selectedRoute)!.endDate), "MMM d")}
                      </p>
                      <p className="text-neutral-500 text-xs font-medium">
                        ${routes.find(r => r.id === selectedRoute)?.price}
                      </p>
                      <Button
                        className="w-full mt-2"
                        size="sm"
                        variant="outline"
                        onClick={() => onSelectRoute(selectedRoute)}
                      >
                        Добавить в избранное
                      </Button>
                    </div>
                  </Popup>
                )}
                
                {/* POI Markers */}
                {showPOIs && pois.map(poi => {
                  // Получаем координаты города для POI, так как у POI нет собственных координат
                  const poiCity = cities.find(city => city.id === poi.cityId);
                  if (!poiCity) return null;
                  
                  // Рассчитываем координаты с небольшим смещением от города
                  // Это просто имитация, в реальности у POI должны быть свои координаты
                  const offset = (poi.id % 5) * 0.002;
                  const lat = poiCity.coordinates.lat + offset;
                  const lng = poiCity.coordinates.lng + offset;
                  
                  return (
                    <Marker
                      key={`poi-${poi.id}`}
                      latitude={lat}
                      longitude={lng}
                      offsetLeft={-15}
                      offsetTop={-30}
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() => setSelectedPoi(poi.id)}
                      >
                        <MapPin 
                          className="text-primary" 
                          size={20} 
                          fill={selectedPoi === poi.id ? "rgba(var(--primary-rgb), 0.5)" : "transparent"}
                        />
                      </div>
                    </Marker>
                  );
                })}
                
                {/* POI Popup */}
                {selectedPoi && (
                  <Popup
                    latitude={(cities.find(city => city.id === pois.find(p => p.id === selectedPoi)?.cityId)?.coordinates.lat || 0) + 
                      ((selectedPoi % 5) * 0.002)}
                    longitude={(cities.find(city => city.id === pois.find(p => p.id === selectedPoi)?.cityId)?.coordinates.lng || 0) + 
                      ((selectedPoi % 5) * 0.002)}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setSelectedPoi(null)}
                    anchor="bottom"
                  >
                    <div className="p-2 w-52">
                      {pois.find(p => p.id === selectedPoi) && (
                        <>
                          <div className="mb-2">
                            <img 
                              src={pois.find(p => p.id === selectedPoi)?.image} 
                              alt={pois.find(p => p.id === selectedPoi)?.name} 
                              className="w-full h-24 object-cover rounded-md"
                            />
                          </div>
                          <h4 className="font-medium text-sm mb-1">
                            {pois.find(p => p.id === selectedPoi)?.name}
                          </h4>
                          <p className="text-neutral-500 text-xs mb-2">
                            {pois.find(p => p.id === selectedPoi)?.description || "Нет описания"}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {pois.find(p => p.id === selectedPoi)?.tags.slice(0, 3).map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline"
                                className="bg-primary/10 text-primary text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </Popup>
                )}
              </ReactMapGL>
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
