import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { City, Route } from "@shared/schema";
import RoutesList from "@/components/RoutesList";
import MapView from "@/components/MapView";
import SideMenu from "@/components/SideMenu";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, Clock, Map, Landmark } from "lucide-react";

const Favorites = () => {
  const { 
    favorites, 
    routes, 
    cities, 
    removeFromFavorites, 
    isMapViewOpen, 
    toggleMapView, 
    loadCities,
    loadRoutes
  } = useStore();

  const [comparisonView, setComparisonView] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);

  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);

  // Get favorited routes
  const favoriteRoutes = routes.filter(route => favorites.includes(route.id));

  // Toggle route selection for comparison
  const toggleRouteSelection = (routeId: number) => {
    setSelectedRoutes(prev => 
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };

  // Calculate route metrics for comparison
  const getRouteDuration = (route: Route): number => {
    const start = new Date(route.startDate);
    const end = new Date(route.endDate);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoutePricePerDay = (route: Route): number => {
    const days = getRouteDuration(route);
    return Math.round(route.price / days);
  };

  const getCitiesCount = (route: Route): number => {
    return route.cities.length;
  };

  // Filter routes for comparison
  const routesToCompare = favoriteRoutes.filter(route => 
    selectedRoutes.includes(route.id)
  );

  // Map through favorited routes and get city details
  const getCityDetails = (cityId: number): City | undefined => {
    return cities.find(city => city.id === cityId);
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <SideMenu />
      
      <h1 className="text-2xl font-bold mb-4 dark:text-white">My Favorites</h1>
      
      <Tabs defaultValue="routes" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="routes">Saved Routes</TabsTrigger>
          <TabsTrigger value="compare" disabled={favoriteRoutes.length < 2}>
            Compare Routes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="routes" className="mt-4">
          {favoriteRoutes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
                <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                  You haven't saved any routes yet.
                </p>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Explore cities and add routes to your favorites.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <RoutesList
                routes={favoriteRoutes}
                cities={cities}
                onAddToFavorites={() => {}}
                onToggleMapView={toggleMapView}
                onRemoveFromFavorites={removeFromFavorites}
                favorites={favorites}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="compare" className="mt-4">
          {selectedRoutes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-4">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-2">
                    Select routes to compare
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {favoriteRoutes.map(route => (
                      <div
                        key={route.id}
                        className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 cursor-pointer"
                        onClick={() => toggleRouteSelection(route.id)}
                      >
                        <h4 className="font-medium text-sm dark:text-white">{route.name}</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
                          {route.cities.map(cityId => 
                            getCityDetails(cityId)?.name
                          ).join(" → ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Route Comparison</CardTitle>
                      <CardDescription>
                        Compare details of your selected routes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b dark:border-neutral-700">
                              <th className="text-left py-2">Route</th>
                              <th className="text-center py-2">
                                <div className="flex items-center justify-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Duration
                                </div>
                              </th>
                              <th className="text-center py-2">
                                <div className="flex items-center justify-center">
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Price
                                </div>
                              </th>
                              <th className="text-center py-2">
                                <div className="flex items-center justify-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Per Day
                                </div>
                              </th>
                              <th className="text-center py-2">
                                <div className="flex items-center justify-center">
                                  <Landmark className="h-4 w-4 mr-1" />
                                  Cities
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {routesToCompare.map(route => (
                              <tr 
                                key={route.id} 
                                className="border-b dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                                onClick={() => toggleRouteSelection(route.id)}
                              >
                                <td className="py-3">
                                  <div className="flex items-center">
                                    <span 
                                      className="w-2 h-2 rounded-full mr-2" 
                                      style={{ backgroundColor: route.color }}
                                    ></span>
                                    {route.name}
                                  </div>
                                </td>
                                <td className="text-center py-3">
                                  {getRouteDuration(route)} days
                                </td>
                                <td className="text-center py-3">
                                  ${route.price}
                                </td>
                                <td className="text-center py-3">
                                  ${getRoutePricePerDay(route)}/day
                                </td>
                                <td className="text-center py-3">
                                  {getCitiesCount(route)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <MapView 
        isOpen={isMapViewOpen}
        cities={cities}
        routes={favoriteRoutes}
        onClose={toggleMapView}
        onSelectRoute={() => {}}
        onSelectCity={() => {}}
      />
    </div>
  );
};

export default Favorites;
