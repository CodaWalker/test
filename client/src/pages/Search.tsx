import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { City, Route } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoutesList from "@/components/RoutesList";
import MapView from "@/components/MapView";
import SideMenu from "@/components/SideMenu";
import { Search as SearchIcon, Map, MapPin, Calendar, DollarSign, Info, ChevronRight } from "lucide-react";

const Search = () => {
  const { 
    cities, 
    routes, 
    favorites,
    addToFavorites,
    loadCities,
    loadRoutes,
    isMapViewOpen,
    toggleMapView
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("cities");
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  
  useEffect(() => {
    loadCities();
    loadRoutes();
  }, [loadCities, loadRoutes]);
  
  // Filter cities based on search query
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter routes based on search query
  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cities.some(city => 
      route.cities.includes(city.id) && 
      (city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );
  
  // Get routes for a specific city
  const getRoutesForCity = (cityId: number) => {
    return routes.filter(route => route.cities.includes(cityId));
  };
  
  // Handle city card click
  const handleCityClick = (cityId: number) => {
    setSelectedCityId(cityId === selectedCityId ? null : cityId);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <SideMenu />
      
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search cities, countries, or interests..."
          className="pl-10 pr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="cities" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cities" className="mt-4">
          {filteredCities.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <p>No cities found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCities.map(city => (
                <Card 
                  key={city.id} 
                  className={`overflow-hidden cursor-pointer transition-shadow ${
                    selectedCityId === city.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleCityClick(city.id)}
                >
                  <div className="relative h-36">
                    <img 
                      src={city.mainImage} 
                      alt={city.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="font-bold text-lg">{city.name}</h3>
                          <p className="text-sm opacity-90">{city.country}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {city.tags.slice(0, 2).map((tag, i) => (
                            <Badge 
                              key={i} 
                              variant="outline"
                              className="bg-white/20 text-white border-0 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedCityId === city.id && (
                    <CardContent className="p-4">
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                        {city.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {city.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-neutral-500" />
                          <span className="dark:text-neutral-300">{city.country}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-neutral-500" />
                          <span className="dark:text-neutral-300">{city.localInfo.bestSeason}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Info className="h-4 w-4 mr-1 text-neutral-500" />
                          <span className="dark:text-neutral-300">{city.localInfo.language}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-4 w-4 mr-1 text-neutral-500" />
                          <span className="dark:text-neutral-300">{city.localInfo.currency}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2 dark:text-white">Available Routes</h4>
                        <RoutesList 
                          routes={getRoutesForCity(city.id)}
                          cities={cities}
                          currentCityId={city.id}
                          onAddToFavorites={addToFavorites}
                          onToggleMapView={toggleMapView}
                          showMapButton={false}
                          favorites={favorites}
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="routes" className="mt-4">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <p>No routes found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg dark:text-white">Search Results</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMapView}
                  className="flex items-center"
                >
                  <Map className="h-4 w-4 mr-1" />
                  View Map
                </Button>
              </div>
              
              <RoutesList 
                routes={filteredRoutes}
                cities={cities}
                onAddToFavorites={addToFavorites}
                onToggleMapView={toggleMapView}
                showMapButton={false}
                favorites={favorites}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <MapView 
        isOpen={isMapViewOpen}
        cities={cities}
        routes={activeTab === "cities" && selectedCityId 
          ? getRoutesForCity(selectedCityId) 
          : filteredRoutes}
        onClose={toggleMapView}
        onSelectRoute={addToFavorites}
        onSelectCity={handleCityClick}
      />
    </div>
  );
};

export default Search;
