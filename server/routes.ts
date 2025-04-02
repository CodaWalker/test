import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertFavoriteSchema,
  insertSwipeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/cities", async (req, res) => {
    try {
      const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
      const cities = await storage.getCitiesByTags(tags);
      res.json(cities);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const city = await storage.getCity(parseInt(req.params.id));
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(city);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cities/:id/pois", async (req, res) => {
    try {
      const pois = await storage.getPoisByCity(parseInt(req.params.id));
      res.json(pois);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/routes", async (req, res) => {
    try {
      const cityIds = req.query.cities 
        ? (req.query.cities as string).split(",").map(id => parseInt(id)) 
        : [];
      
      const routes = await storage.getRoutesByCities(cityIds);
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/routes/:id", async (req, res) => {
    try {
      const route = await storage.getRoute(parseInt(req.params.id));
      if (!route) {
        return res.status(404).json({ message: "Route not found" });
      }
      res.json(route);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id/preferences", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.preferences);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/users/:id/preferences", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserPreferences(userId, req.body);
      res.json(updatedUser?.preferences);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoritesByUser(parseInt(req.params.id));
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/favorites", async (req, res) => {
    try {
      const { userId, routeId } = req.body;
      const success = await storage.removeFavorite(userId, routeId);
      if (!success) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/swipes", async (req, res) => {
    try {
      const validatedData = insertSwipeSchema.parse(req.body);
      const swipe = await storage.createSwipe(validatedData);
      res.status(201).json(swipe);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
