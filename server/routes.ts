import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertCarSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Cars routes
  app.get("/api/cars", async (req, res, next) => {
    try {
      // Handle filters if any from query params
      const filters: Record<string, any> = {};
      
      if (req.query.make) filters.make = req.query.make;
      if (req.query.model) filters.model = req.query.model;
      if (req.query.year) filters.year = parseInt(req.query.year as string);
      if (req.query.minPrice && req.query.maxPrice) {
        // For price range, we'll filter in the handler
        const minPrice = parseInt(req.query.minPrice as string);
        const maxPrice = parseInt(req.query.maxPrice as string);
        
        const cars = await storage.getCars();
        const filteredCars = cars.filter(car => 
          car.price >= minPrice && car.price <= maxPrice &&
          Object.entries(filters).every(([key, value]) => 
            // @ts-ignore
            car[key] === value
          )
        );
        return res.json(filteredCars);
      }

      const cars = await storage.getCars(filters);
      res.json(cars);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/cars/:id", async (req, res, next) => {
    try {
      const carId = parseInt(req.params.id);
      const car = await storage.getCar(carId);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cars", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create a listing" });
    }

    try {
      const validatedData = insertCarSchema.parse(req.body);
      const car = await storage.createCar({
        ...validatedData,
        userId: req.user!.id
      });
      
      res.status(201).json(car);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/cars/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to update a listing" });
    }

    try {
      const carId = parseInt(req.params.id);
      const car = await storage.getCar(carId);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      if (car.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to update this listing" });
      }
      
      const updatedCar = await storage.updateCar(carId, req.body);
      res.json(updatedCar);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cars/:id", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to delete a listing" });
    }

    try {
      const carId = parseInt(req.params.id);
      const car = await storage.getCar(carId);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      if (car.userId !== req.user!.id) {
        return res.status(403).json({ message: "You don't have permission to delete this listing" });
      }
      
      await storage.deleteCar(carId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Favorites routes
  app.get("/api/favorites", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view favorites" });
    }

    try {
      const favorites = await storage.getFavorites(req.user!.id);
      
      // Get all cars for these favorites
      const carIds = favorites.map(fav => fav.carId);
      const favoriteCars = await Promise.all(
        carIds.map(id => storage.getCar(id))
      );
      
      // Filter out any undefined entries (in case a car was deleted)
      const validCars = favoriteCars.filter(car => car !== undefined);
      
      res.json(validCars);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/favorites", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add favorites" });
    }

    try {
      const carId = parseInt(req.body.carId);
      const car = await storage.getCar(carId);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      const favorite = await storage.addFavorite({
        userId: req.user!.id,
        carId
      });
      
      res.status(201).json(favorite);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/favorites/:carId", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to remove favorites" });
    }

    try {
      const carId = parseInt(req.params.carId);
      await storage.removeFavorite(req.user!.id, carId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Car comparison routes
  app.get("/api/comparisons", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view comparisons" });
    }

    try {
      const comparisons = await storage.getUserCarComparisons(req.user!.id);
      res.json(comparisons);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/comparisons", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create comparisons" });
    }

    try {
      const carIds = req.body.carIds;
      
      if (!Array.isArray(carIds) || carIds.length < 2) {
        return res.status(400).json({ message: "At least two car IDs are required for comparison" });
      }
      
      // Verify all cars exist
      for (const id of carIds) {
        const car = await storage.getCar(id);
        if (!car) {
          return res.status(404).json({ message: `Car with ID ${id} not found` });
        }
      }
      
      const comparison = await storage.createCarComparison({
        userId: req.user!.id,
        carIds
      });
      
      res.status(201).json(comparison);
    } catch (error) {
      next(error);
    }
  });

  // Car shops routes
  app.get("/api/shops", async (req, res, next) => {
    try {
      const shops = await storage.getCarShops();
      res.json(shops);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/shops/:id", async (req, res, next) => {
    try {
      const shopId = parseInt(req.params.id);
      const shop = await storage.getCarShop(shopId);
      
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }
      
      res.json(shop);
    } catch (error) {
      next(error);
    }
  });

  // Car maintenance shops routes
  app.get("/api/maintenance-shops", async (req, res, next) => {
    try {
      const shops = await storage.getCarMaintenanceShops();
      res.json(shops);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/maintenance-shops/:id", async (req, res, next) => {
    try {
      const shopId = parseInt(req.params.id);
      const shop = await storage.getCarMaintenanceShop(shopId);
      
      if (!shop) {
        return res.status(404).json({ message: "Maintenance shop not found" });
      }
      
      res.json(shop);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
