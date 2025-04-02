import { 
  users, type User, type InsertUser,
  cities, type City, type InsertCity,
  pois, type Poi, type InsertPoi,
  routes, type Route, type InsertRoute,
  favorites, type Favorite, type InsertFavorite,
  swipes, type Swipe, type InsertSwipe
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPreferences(id: number, preferences: User['preferences']): Promise<User | undefined>;
  
  // City operations
  getCity(id: number): Promise<City | undefined>;
  getCities(): Promise<City[]>;
  getCitiesByTags(tags: string[]): Promise<City[]>;
  createCity(city: InsertCity): Promise<City>;
  
  // POI operations
  getPoisByCity(cityId: number): Promise<Poi[]>;
  createPoi(poi: InsertPoi): Promise<Poi>;
  
  // Route operations
  getRoute(id: number): Promise<Route | undefined>;
  getRoutesByCities(cityIds: number[]): Promise<Route[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Favorite operations
  getFavoritesByUser(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, routeId: number): Promise<boolean>;
  
  // Swipe operations
  getSwipesByUser(userId: number): Promise<Swipe[]>;
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cities: Map<number, City>;
  private pois: Map<number, Poi>;
  private routes: Map<number, Route>;
  private favorites: Map<number, Favorite>;
  private swipes: Map<number, Swipe>;
  private currentIds: {
    users: number;
    cities: number;
    pois: number;
    routes: number;
    favorites: number;
    swipes: number;
  };

  constructor() {
    this.users = new Map();
    this.cities = new Map();
    this.pois = new Map();
    this.routes = new Map();
    this.favorites = new Map();
    this.swipes = new Map();
    this.currentIds = {
      users: 1,
      cities: 1,
      pois: 1,
      routes: 1,
      favorites: 1,
      swipes: 1
    };

    // Initialize with some sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPreferences(id: number, preferences: User['preferences']): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, preferences };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // City operations
  async getCity(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getCitiesByTags(tags: string[]): Promise<City[]> {
    if (tags.length === 0) return this.getCities();
    
    return Array.from(this.cities.values()).filter(city => 
      city.tags.some(tag => tags.includes(tag))
    );
  }

  async createCity(city: InsertCity): Promise<City> {
    const id = this.currentIds.cities++;
    const newCity: City = { ...city, id };
    this.cities.set(id, newCity);
    return newCity;
  }

  // POI operations
  async getPoisByCity(cityId: number): Promise<Poi[]> {
    return Array.from(this.pois.values()).filter(poi => poi.cityId === cityId);
  }

  async createPoi(poi: InsertPoi): Promise<Poi> {
    const id = this.currentIds.pois++;
    const newPoi: Poi = { ...poi, id };
    this.pois.set(id, newPoi);
    return newPoi;
  }

  // Route operations
  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getRoutesByCities(cityIds: number[]): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(route => 
      cityIds.some(cityId => route.cities.includes(cityId))
    );
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const id = this.currentIds.routes++;
    const newRoute: Route = { ...route, id };
    this.routes.set(id, newRoute);
    return newRoute;
  }

  // Favorite operations
  async getFavoritesByUser(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentIds.favorites++;
    const newFavorite: Favorite = { 
      ...favorite, 
      id, 
      dateAdded: new Date() 
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: number, routeId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      fav => fav.userId === userId && fav.routeId === routeId
    );
    
    if (!favorite) return false;
    
    return this.favorites.delete(favorite.id);
  }

  // Swipe operations
  async getSwipesByUser(userId: number): Promise<Swipe[]> {
    return Array.from(this.swipes.values()).filter(swipe => swipe.userId === userId);
  }

  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const id = this.currentIds.swipes++;
    const newSwipe: Swipe = { 
      ...swipe, 
      id, 
      timestamp: new Date() 
    };
    this.swipes.set(id, newSwipe);
    return newSwipe;
  }

  private initializeData(): void {
    // This would be populated with initial data
    // For now we'll leave it empty as the frontend will mock the data
  }
}

export const storage = new MemStorage();
