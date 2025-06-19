import { 
  users, disasters, reports, resources, cache, socialMediaPosts,
  type User, type InsertUser,
  type Disaster, type InsertDisaster,
  type Report, type InsertReport,
  type Resource, type InsertResource,
  type SocialMediaPost, type InsertSocialMediaPost,
  type CacheEntry
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Disasters
  getDisasters(filters?: { tag?: string; ownerId?: string }): Promise<Disaster[]>;
  getDisaster(id: number): Promise<Disaster | undefined>;
  createDisaster(disaster: InsertDisaster): Promise<Disaster>;
  updateDisaster(id: number, disaster: Partial<InsertDisaster>, userId: string): Promise<Disaster | undefined>;
  deleteDisaster(id: number): Promise<boolean>;

  // Reports
  getReports(disasterId?: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportVerification(id: number, status: string): Promise<Report | undefined>;

  // Resources
  getResources(disasterId?: number): Promise<Resource[]>;
  getNearbyResources(lat: number, lon: number, radiusKm: number): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Social Media
  getSocialMediaPosts(disasterId?: number): Promise<SocialMediaPost[]>;
  createSocialMediaPost(post: InsertSocialMediaPost): Promise<SocialMediaPost>;

  // Cache
  getCacheEntry(key: string): Promise<CacheEntry | undefined>;
  setCacheEntry(key: string, value: any, ttlMinutes: number): Promise<void>;
  clearExpiredCache(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private disasters: Map<number, Disaster>;
  private reports: Map<number, Report>;
  private resources: Map<number, Resource>;
  private socialMediaPosts: Map<number, SocialMediaPost>;
  private cache: Map<string, CacheEntry>;
  private currentUserId: number = 1;
  private currentDisasterId: number = 1;
  private currentReportId: number = 1;
  private currentResourceId: number = 1;
  private currentSocialMediaId: number = 1;

  constructor() {
    this.users = new Map();
    this.disasters = new Map();
    this.reports = new Map();
    this.resources = new Map();
    this.socialMediaPosts = new Map();
    this.cache = new Map();

    // Initialize with mock users
    this.createUser({ username: "netrunnerX", password: "password", role: "admin" });
    this.createUser({ username: "reliefAdmin", password: "password", role: "admin" });
    this.createUser({ username: "citizen1", password: "password", role: "contributor" });

    // Initialize with Indian emergency resources
    this.createResource({
      name: "Mumbai Flood Relief Center",
      locationName: "Bandra Community Center, Mumbai",
      latitude: 19.0596,
      longitude: 72.8295,
      type: "shelter"
    });

    this.createResource({
      name: "Delhi Emergency Medical Center",
      locationName: "AIIMS Delhi Emergency Wing",
      latitude: 28.5672,
      longitude: 77.2100,
      type: "medical"
    });

    this.createResource({
      name: "Chennai Cyclone Evacuation Center",
      locationName: "Anna University Sports Complex",
      latitude: 13.0181,
      longitude: 80.2358,
      type: "shelter"
    });

    this.createResource({
      name: "Bangalore Fire Station",
      locationName: "Electronic City Fire Station",
      latitude: 12.8456,
      longitude: 77.6603,
      type: "fire"
    });

    this.createResource({
      name: "Kolkata Traffic Control Center",
      locationName: "Kolkata Police Traffic HQ",
      latitude: 22.5726,
      longitude: 88.3639,
      type: "transport"
    });

    this.createResource({
      name: "Indian Red Cross - Mumbai",
      locationName: "Red Cross Bhavan, Mumbai",
      latitude: 19.0728,
      longitude: 72.8826,
      type: "medical"
    });

    this.createResource({
      name: "NDRF Station Delhi",
      locationName: "National Disaster Response Force, Delhi",
      latitude: 28.6448,
      longitude: 77.2141,
      type: "rescue"
    });

    this.createResource({
      name: "Chennai Marina Beach Rescue Post",
      locationName: "Marina Beach Lifeguard Station",
      latitude: 13.0478,
      longitude: 80.2785,
      type: "rescue"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Disasters  
  async getDisasters(filters?: { tag?: string; ownerId?: string }): Promise<Disaster[]> {
    let disasters = Array.from(this.disasters.values());
    
    if (filters?.tag) {
      disasters = disasters.filter(d => d.tags.includes(filters.tag!));
    }
    
    if (filters?.ownerId) {
      disasters = disasters.filter(d => d.ownerId === filters.ownerId);
    }

    return disasters.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getDisaster(id: number): Promise<Disaster | undefined> {
    return this.disasters.get(id);
  }

  async createDisaster(insertDisaster: InsertDisaster): Promise<Disaster> {
    const id = this.currentDisasterId++;
    const disaster: Disaster = {
      ...insertDisaster,
      id,
      createdAt: new Date(),
      auditTrail: [{ action: "create", userId: insertDisaster.ownerId, timestamp: new Date().toISOString() }]
    };
    this.disasters.set(id, disaster);
    return disaster;
  }

  async updateDisaster(id: number, updates: Partial<InsertDisaster>, userId: string): Promise<Disaster | undefined> {
    const disaster = this.disasters.get(id);
    if (!disaster) return undefined;

    const updatedDisaster: Disaster = {
      ...disaster,
      ...updates,
      auditTrail: [
        ...disaster.auditTrail as any[],
        { action: "update", userId, timestamp: new Date().toISOString() }
      ]
    };
    
    this.disasters.set(id, updatedDisaster);
    return updatedDisaster;
  }

  async deleteDisaster(id: number): Promise<boolean> {
    return this.disasters.delete(id);
  }

  // Reports
  async getReports(disasterId?: number): Promise<Report[]> {
    let reports = Array.from(this.reports.values());
    
    if (disasterId) {
      reports = reports.filter(r => r.disasterId === disasterId);
    }

    return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = {
      ...insertReport,
      id,
      createdAt: new Date()
    };
    this.reports.set(id, report);
    return report;
  }

  async updateReportVerification(id: number, status: string): Promise<Report | undefined> {
    const report = this.reports.get(id);
    if (!report) return undefined;

    const updatedReport: Report = { ...report, verificationStatus: status };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  // Resources
  async getResources(disasterId?: number): Promise<Resource[]> {
    let resources = Array.from(this.resources.values());
    
    if (disasterId) {
      resources = resources.filter(r => r.disasterId === disasterId);
    }

    return resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getNearbyResources(lat: number, lon: number, radiusKm: number): Promise<Resource[]> {
    const resources = Array.from(this.resources.values());
    
    return resources.filter(resource => {
      const distance = this.calculateDistance(lat, lon, resource.latitude, resource.longitude);
      return distance <= radiusKm;
    }).sort((a, b) => {
      const distA = this.calculateDistance(lat, lon, a.latitude, a.longitude);
      const distB = this.calculateDistance(lat, lon, b.latitude, b.longitude);
      return distA - distB;
    });
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: new Date()
    };
    this.resources.set(id, resource);
    return resource;
  }

  // Social Media
  async getSocialMediaPosts(disasterId?: number): Promise<SocialMediaPost[]> {
    let posts = Array.from(this.socialMediaPosts.values());
    
    if (disasterId) {
      posts = posts.filter(p => p.disasterId === disasterId);
    }

    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createSocialMediaPost(insertPost: InsertSocialMediaPost): Promise<SocialMediaPost> {
    const id = this.currentSocialMediaId++;
    const post: SocialMediaPost = {
      ...insertPost,
      id,
      createdAt: new Date()
    };
    this.socialMediaPosts.set(id, post);
    return post;
  }

  // Cache
  async getCacheEntry(key: string): Promise<CacheEntry | undefined> {
    const entry = this.cache.get(key);
    if (entry && new Date() > new Date(entry.expiresAt)) {
      this.cache.delete(key);
      return undefined;
    }
    return entry;
  }

  async setCacheEntry(key: string, value: any, ttlMinutes: number): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + ttlMinutes);
    
    this.cache.set(key, {
      key,
      value,
      expiresAt
    });
  }

  async clearExpiredCache(): Promise<void> {
    const now = new Date();
    for (const [key, entry] of this.cache.entries()) {
      if (now > new Date(entry.expiresAt)) {
        this.cache.delete(key);
      }
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
}

export const storage = new MemStorage();
