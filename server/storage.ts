import { users, types, User, InsertUser, cars, Car, InsertCar, favorites, Favorite, InsertFavorite, carComparisons, CarComparison, InsertCarComparison, carShops, CarShop, InsertCarShop, carMaintenanceShops, CarMaintenanceShop, InsertCarMaintenanceShop } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Car operations
  getCar(id: number): Promise<Car | undefined>;
  getCars(filters?: Partial<Car>): Promise<Car[]>;
  createCar(car: InsertCar & { userId: number }): Promise<Car>;
  updateCar(id: number, carData: Partial<Car>): Promise<Car | undefined>;
  deleteCar(id: number): Promise<boolean>;
  
  // Favorites operations
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, carId: number): Promise<boolean>;
  
  // Car comparison operations
  getCarComparison(id: number): Promise<CarComparison | undefined>;
  getUserCarComparisons(userId: number): Promise<CarComparison[]>;
  createCarComparison(comparison: InsertCarComparison & { userId: number }): Promise<CarComparison>;
  
  // Car shops operations
  getCarShops(): Promise<CarShop[]>;
  getCarShop(id: number): Promise<CarShop | undefined>;
  createCarShop(shop: InsertCarShop): Promise<CarShop>;
  
  // Car maintenance shops operations
  getCarMaintenanceShops(): Promise<CarMaintenanceShop[]>;
  getCarMaintenanceShop(id: number): Promise<CarMaintenanceShop | undefined>;
  createCarMaintenanceShop(shop: InsertCarMaintenanceShop): Promise<CarMaintenanceShop>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private favorites: Map<string, Favorite>;
  private carComparisons: Map<number, CarComparison>;
  private carShops: Map<number, CarShop>;
  private carMaintenanceShops: Map<number, CarMaintenanceShop>;
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private carIdCounter: number;
  private carComparisonIdCounter: number;
  private carShopIdCounter: number;
  private carMaintenanceShopIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.favorites = new Map();
    this.carComparisons = new Map();
    this.carShops = new Map();
    this.carMaintenanceShops = new Map();
    this.userIdCounter = 1;
    this.carIdCounter = 1;
    this.carComparisonIdCounter = 1;
    this.carShopIdCounter = 1;
    this.carMaintenanceShopIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Add some mock data
    this.initMockData();
  }
  
  private initMockData() {
    // Add mock car shops
    this.createCarShop({
      name: "Premium Auto Dealership",
      address: "123 Main St, New York, NY",
      latitude: "40.7128",
      longitude: "-74.006",
      phone: "555-123-4567",
      website: "https://premiumauto.example.com",
      types: ["new", "used", "luxury"],
      rating: 4,
    });
    
    this.createCarShop({
      name: "Value Motors",
      address: "456 Oak Ave, Los Angeles, CA",
      latitude: "34.0522",
      longitude: "-118.2437",
      phone: "555-987-6543",
      website: "https://valuemotors.example.com",
      types: ["used", "budget"],
      rating: 3,
    });
    
    // Add mock maintenance shops
    this.createCarMaintenanceShop({
      name: "Quick Service Auto",
      address: "789 Pine Rd, Chicago, IL",
      latitude: "41.8781",
      longitude: "-87.6298",
      phone: "555-456-7890",
      website: "https://quickservice.example.com",
      services: ["oil change", "brakes", "tire rotation"],
      rating: 5,
    });
    
    this.createCarMaintenanceShop({
      name: "Complete Car Care",
      address: "321 Maple Dr, Houston, TX",
      latitude: "29.7604",
      longitude: "-95.3698",
      phone: "555-222-3333",
      website: "https://completecare.example.com",
      services: ["diagnostics", "engine repair", "transmission", "electrical"],
      rating: 4,
    });
    
    // Add mock cars
    const mockCars = [
      {
        make: "Toyota",
        model: "Camry",
        year: 2022,
        price: 25000,
        mileage: 5000,
        color: "Silver",
        fuelType: "Gasoline",
        transmission: "Automatic",
        description: "Like new Toyota Camry with low mileage. Great fuel efficiency and comfortable ride.",
        condition: "Excellent",
        imageUrls: ["https://images.unsplash.com/photo-1618418721668-0d1f72aa4bab"],
        location: "New York, NY",
        latitude: "40.7128",
        longitude: "-74.006",
        features: ["Bluetooth", "Backup Camera", "Cruise Control"],
        listingType: "regular",
      },
      {
        make: "Mercedes-Benz",
        model: "S-Class",
        year: 2021,
        price: 89000,
        mileage: 12000,
        color: "Black",
        fuelType: "Gasoline",
        transmission: "Automatic",
        description: "Luxury Mercedes-Benz S-Class with premium features and elegant design.",
        condition: "Excellent",
        imageUrls: ["https://images.unsplash.com/photo-1581814706561-f5bbfa7d984a"],
        location: "Los Angeles, CA",
        latitude: "34.0522",
        longitude: "-118.2437",
        features: ["Leather Seats", "Navigation", "Panoramic Roof", "Premium Sound"],
        listingType: "featured",
      },
      {
        make: "BMW",
        model: "i8",
        year: 2020,
        price: 95000,
        mileage: 8000,
        color: "White",
        fuelType: "Hybrid",
        transmission: "Automatic",
        description: "Stunning BMW i8 hybrid sports car with futuristic design and excellent performance.",
        condition: "Excellent",
        imageUrls: ["https://images.unsplash.com/photo-1553440569-bcc63803a83d"],
        location: "Miami, FL",
        latitude: "25.7617",
        longitude: "-80.1918",
        features: ["Sport Package", "Head-up Display", "Carbon Fiber Trim"],
        listingType: "featured",
      },
      {
        make: "Honda",
        model: "Civic",
        year: 2019,
        price: 16500,
        mileage: 35000,
        color: "Blue",
        fuelType: "Gasoline",
        transmission: "Manual",
        description: "Reliable Honda Civic with excellent gas mileage and sporty handling.",
        condition: "Good",
        imageUrls: ["https://images.unsplash.com/photo-1570280406792-bf58b7c59247"],
        location: "Chicago, IL",
        latitude: "41.8781",
        longitude: "-87.6298",
        features: ["Apple CarPlay", "Android Auto", "Alloy Wheels"],
        listingType: "regular",
      },
      {
        make: "Ford",
        model: "Mustang",
        year: 2023,
        price: 45000,
        mileage: 1000,
        color: "Red",
        fuelType: "Gasoline",
        transmission: "Automatic",
        description: "Brand new Ford Mustang with powerful engine and classic American muscle car design.",
        condition: "New",
        imageUrls: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d2"],
        location: "Dallas, TX",
        latitude: "32.7767",
        longitude: "-96.7970",
        features: ["Leather Seats", "Premium Sound", "Performance Package"],
        listingType: "featured",
      },
      {
        make: "Tesla",
        model: "Model 3",
        year: 2022,
        price: 42000,
        mileage: 10000,
        color: "White",
        fuelType: "Electric",
        transmission: "Automatic",
        description: "Tesla Model 3 with long-range battery and Autopilot features.",
        condition: "Excellent",
        imageUrls: ["https://images.unsplash.com/photo-1485291571150-772bcfc10da5"],
        location: "San Francisco, CA",
        latitude: "37.7749",
        longitude: "-122.4194",
        features: ["Autopilot", "Premium Interior", "Glass Roof"],
        listingType: "featured",
      }
    ];
    
    mockCars.forEach(car => {
      this.createCar({
        ...car,
        userId: 1
      });
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isVerified: false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Car methods
  async getCar(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }
  
  async getCars(filters?: Partial<Car>): Promise<Car[]> {
    let allCars = Array.from(this.cars.values());
    
    if (filters) {
      return allCars.filter(car => {
        for (const [key, value] of Object.entries(filters)) {
          // Skip undefined or null filters
          if (value === undefined || value === null) continue;
          
          // @ts-ignore: Dynamic property access
          if (car[key] !== value) return false;
        }
        return true;
      });
    }
    
    return allCars;
  }
  
  async createCar(carData: InsertCar & { userId: number }): Promise<Car> {
    const id = this.carIdCounter++;
    const now = new Date();
    const car: Car = {
      ...carData,
      id,
      isActive: true,
      createdAt: now
    };
    this.cars.set(id, car);
    return car;
  }
  
  async updateCar(id: number, carData: Partial<Car>): Promise<Car | undefined> {
    const car = await this.getCar(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...carData };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }
  
  async deleteCar(id: number): Promise<boolean> {
    return this.cars.delete(id);
  }
  
  // Favorites methods
  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
  }
  
  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const key = `${favorite.userId}-${favorite.carId}`;
    this.favorites.set(key, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, carId: number): Promise<boolean> {
    const key = `${userId}-${carId}`;
    return this.favorites.delete(key);
  }
  
  // Car comparison methods
  async getCarComparison(id: number): Promise<CarComparison | undefined> {
    return this.carComparisons.get(id);
  }
  
  async getUserCarComparisons(userId: number): Promise<CarComparison[]> {
    return Array.from(this.carComparisons.values()).filter(
      comparison => comparison.userId === userId
    );
  }
  
  async createCarComparison(comparisonData: InsertCarComparison & { userId: number }): Promise<CarComparison> {
    const id = this.carComparisonIdCounter++;
    const now = new Date();
    const comparison: CarComparison = {
      ...comparisonData,
      id,
      createdAt: now
    };
    this.carComparisons.set(id, comparison);
    return comparison;
  }
  
  // Car shop methods
  async getCarShops(): Promise<CarShop[]> {
    return Array.from(this.carShops.values());
  }
  
  async getCarShop(id: number): Promise<CarShop | undefined> {
    return this.carShops.get(id);
  }
  
  async createCarShop(shopData: InsertCarShop): Promise<CarShop> {
    const id = this.carShopIdCounter++;
    const shop: CarShop = {
      ...shopData,
      id
    };
    this.carShops.set(id, shop);
    return shop;
  }
  
  // Car maintenance shop methods
  async getCarMaintenanceShops(): Promise<CarMaintenanceShop[]> {
    return Array.from(this.carMaintenanceShops.values());
  }
  
  async getCarMaintenanceShop(id: number): Promise<CarMaintenanceShop | undefined> {
    return this.carMaintenanceShops.get(id);
  }
  
  async createCarMaintenanceShop(shopData: InsertCarMaintenanceShop): Promise<CarMaintenanceShop> {
    const id = this.carMaintenanceShopIdCounter++;
    const shop: CarMaintenanceShop = {
      ...shopData,
      id
    };
    this.carMaintenanceShops.set(id, shop);
    return shop;
  }
}

export const storage = new MemStorage();
