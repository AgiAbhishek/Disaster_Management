import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDisasterSchema, insertReportSchema, insertResourceSchema } from "@shared/schema";
import { geminiService } from "./services/gemini";
import { geocodingService } from "./services/geocoding";
import { socialMediaService } from "./services/socialMedia";
import { initializeWebSocket, getWebSocketService } from "./services/websocket";

// Mock authentication middleware
const mockAuth = (req: any, res: any, next: any) => {
  // In a real app, this would verify JWT tokens or sessions
  req.user = { username: "netrunnerX", role: "admin" };
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize WebSocket service
  initializeWebSocket(httpServer);

  // Start social media monitoring
  socialMediaService.startRealTimeMonitoring();

  // Apply mock auth to protected routes
  app.use("/api", mockAuth);

  // Disaster routes
  app.get("/api/disasters", async (req, res) => {
    try {
      const { tag, owner } = req.query;
      const disasters = await storage.getDisasters({
        tag: tag as string,
        ownerId: owner as string
      });
      res.json(disasters);
    } catch (error) {
      console.error("Error fetching disasters:", error);
      res.status(500).json({ message: "Failed to fetch disasters" });
    }
  });

  app.get("/api/disasters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const disaster = await storage.getDisaster(id);
      
      if (!disaster) {
        return res.status(404).json({ message: "Disaster not found" });
      }

      res.json(disaster);
    } catch (error) {
      console.error("Error fetching disaster:", error);
      res.status(500).json({ message: "Failed to fetch disaster" });
    }
  });

  app.post("/api/disasters", async (req, res) => {
    try {
      const validatedData = insertDisasterSchema.parse({
        ...req.body,
        ownerId: req.user.username
      });

      const disaster = await storage.createDisaster(validatedData);
      
      // Broadcast update
      getWebSocketService().broadcastDisasterUpdate(disaster);
      
      console.log(`Disaster created: ${disaster.title} by ${req.user.username}`);
      res.status(201).json(disaster);
    } catch (error) {
      console.error("Error creating disaster:", error);
      res.status(500).json({ message: "Failed to create disaster" });
    }
  });

  app.put("/api/disasters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertDisasterSchema.partial().parse(req.body);
      
      const disaster = await storage.updateDisaster(id, updates, req.user.username);
      
      if (!disaster) {
        return res.status(404).json({ message: "Disaster not found" });
      }

      // Broadcast update
      getWebSocketService().broadcastDisasterUpdate(disaster);
      
      console.log(`Disaster updated: ${disaster.title} by ${req.user.username}`);
      res.json(disaster);
    } catch (error) {
      console.error("Error updating disaster:", error);
      res.status(500).json({ message: "Failed to update disaster" });
    }
  });

  app.delete("/api/disasters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDisaster(id);
      
      if (!success) {
        return res.status(404).json({ message: "Disaster not found" });
      }

      // Broadcast update
      getWebSocketService().broadcastDisasterUpdate({ id, deleted: true });
      
      console.log(`Disaster deleted: ID ${id} by ${req.user.username}`);
      res.json({ message: "Disaster deleted successfully" });
    } catch (error) {
      console.error("Error deleting disaster:", error);
      res.status(500).json({ message: "Failed to delete disaster" });
    }
  });

  // Geocoding route
  app.post("/api/geocode", async (req, res) => {
    try {
      const { locationName, description } = req.body;
      
      let location = locationName;
      
      // If no location provided but description is, try to extract it
      if (!location && description) {
        console.log(`Attempting to extract location from: "${description}"`);
        try {
          const cacheKey = `gemini_location_${Buffer.from(description).toString('base64')}`;
          let cachedResult = await storage.getCacheEntry(cacheKey);
          
          if (!cachedResult) {
            location = await geminiService.extractLocation(description);
            console.log(`Gemini extracted location: ${location}`);
            if (location) {
              await storage.setCacheEntry(cacheKey, { location }, 60); // Cache for 1 hour
            }
          } else {
            location = (cachedResult.value as any).location;
            console.log(`Using cached location: ${location}`);
          }
          
          // If Gemini didn't extract a location, try pattern matching immediately
          if (!location) {
            console.log(`Gemini failed to extract location, trying pattern matching on: "${description}"`);
            const locationPatterns = [
              /(Times Square|Central Park|Brooklyn Bridge|Manhattan|Brooklyn|Queens|Bronx|Staten Island)/i,
              /near ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/i,
              /in ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/i,
              /at ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/i,
              /([A-Z][a-z]+(?: [A-Z][a-z]+)*) area/i,
              /downtown ([A-Z][a-z]+)/i
            ];
            
            for (let i = 0; i < locationPatterns.length; i++) {
              const pattern = locationPatterns[i];
              const match = description.match(pattern);
              if (match && match[1]) {
                location = match[1];
                console.log(`Extracted location using pattern ${i}: ${location}`);
                break;
              }
            }
          }
        } catch (error) {
          console.error("Error extracting location with Gemini:", error);
          
          // Fallback: Try basic location pattern matching
          console.log(`Attempting pattern matching on: "${description}"`);
          const locationPatterns = [
            /(Times Square|Central Park|Brooklyn Bridge|Manhattan|Brooklyn|Queens|Bronx|Staten Island)/i,
            /in ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/i,
            /at ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/i,
            /near ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/i,
            /([A-Z][a-z]+(?: [A-Z][a-z]+)*) area/i,
            /downtown ([A-Z][a-z]+)/i
          ];
          
          for (let i = 0; i < locationPatterns.length; i++) {
            const pattern = locationPatterns[i];
            const match = description.match(pattern);
            if (match && match[1]) {
              location = match[1];
              console.log(`Extracted location using pattern ${i}: ${location}`);
              break;
            }
          }
          
          if (!location) {
            return res.status(400).json({ 
              message: "Unable to extract location from description",
              suggestion: "Please specify a location like 'Times Square' or 'Downtown Manhattan'"
            });
          }
        }
      }

      if (!location) {
        return res.status(400).json({ message: "No location provided or found" });
      }

      // Geocode the location
      const cacheKey = `geocode_${Buffer.from(location).toString('base64')}`;
      let cachedResult = await storage.getCacheEntry(cacheKey);
      
      if (!cachedResult) {
        const geocodeResult = await geocodingService.geocodeLocation(location);
        if (geocodeResult) {
          await storage.setCacheEntry(cacheKey, geocodeResult, 60);
          cachedResult = { value: geocodeResult } as any;
        }
      }

      if (!cachedResult) {
        return res.status(404).json({ message: "Location not found" });
      }

      const geocodeData = cachedResult.value as any;
      console.log(`Location geocoded: ${location} -> ${geocodeData.latitude}, ${geocodeData.longitude}`);
      res.json({
        locationName: location,
        latitude: geocodeData.latitude,
        longitude: geocodeData.longitude,
        formattedAddress: geocodeData.formattedAddress
      });
    } catch (error) {
      console.error("Error geocoding location:", error);
      res.status(500).json({ message: "Failed to geocode location" });
    }
  });

  // Social media routes
  app.get("/api/disasters/:id/social-media", async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      const posts = await storage.getSocialMediaPosts(disasterId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching social media posts:", error);
      res.status(500).json({ message: "Failed to fetch social media posts" });
    }
  });

  app.get("/api/social-media", async (req, res) => {
    try {
      const posts = await storage.getSocialMediaPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching social media posts:", error);
      res.status(500).json({ message: "Failed to fetch social media posts" });
    }
  });

  // Resources routes
  app.get("/api/disasters/:id/resources", async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      const { lat, lon, radius = "10" } = req.query;
      
      let resources;
      if (lat && lon) {
        resources = await storage.getNearbyResources(
          parseFloat(lat as string),
          parseFloat(lon as string), 
          parseFloat(radius as string)
        );
      } else {
        resources = await storage.getResources(disasterId);
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources", async (req, res) => {
    try {
      const { lat, lon, radius = "10" } = req.query;
      
      let resources;
      if (lat && lon) {
        resources = await storage.getNearbyResources(
          parseFloat(lat as string),
          parseFloat(lon as string),
          parseFloat(radius as string)
        );
        console.log(`Resource search: ${resources.length} found within ${radius}km of ${lat}, ${lon}`);
      } else {
        resources = await storage.getResources();
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      
      // Broadcast update
      getWebSocketService().broadcastResourcesUpdate(resource);
      
      console.log(`Resource mapped: ${resource.name} at ${resource.locationName}`);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  // Reports routes
  app.get("/api/reports", async (req, res) => {
    try {
      const { disasterId } = req.query;
      const reports = await storage.getReports(disasterId ? parseInt(disasterId as string) : undefined);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse({
        ...req.body,
        userId: req.user.username
      });

      const report = await storage.createReport(validatedData);
      
      // Broadcast update
      getWebSocketService().broadcastReportUpdate(report);
      
      console.log(`Report processed: ${report.content} by ${req.user.username}`);
      res.status(201).json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Image verification route
  app.post("/api/disasters/:id/verify-image", async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }

      const cacheKey = `image_verify_${Buffer.from(imageUrl).toString('base64')}`;
      let cachedResult = await storage.getCacheEntry(cacheKey);
      
      if (!cachedResult) {
        const verification = await geminiService.verifyImage(imageUrl);
        await storage.setCacheEntry(cacheKey, verification, 60);
        cachedResult = { value: verification } as any;
      }

      if (cachedResult) {
        const verificationData = cachedResult.value as any;
        console.log(`Image verified: ${imageUrl} - ${verificationData.isAuthentic ? 'Authentic' : 'Suspicious'}`);
        res.json(verificationData);
      } else {
        res.status(500).json({ message: "Verification failed" });
      }
    } catch (error) {
      console.error("Error verifying image:", error);
      res.status(500).json({ message: "Failed to verify image" });
    }
  });

  // Mock official updates route
  app.get("/api/disasters/:id/official-updates", async (req, res) => {
    try {
      // Mock official updates - in real implementation would scrape from FEMA, Red Cross etc.
      const mockUpdates = [
        {
          source: "FEMA",
          content: "Emergency shelters activated across NYC. Federal assistance approved for affected areas.",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          icon: "fas fa-university"
        },
        {
          source: "NYC Emergency Management", 
          content: "Flash flood warning extended until 11 PM. Avoid unnecessary travel in affected areas.",
          timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
          icon: "fas fa-building"
        }
      ];
      
      res.json(mockUpdates);
    } catch (error) {
      console.error("Error fetching official updates:", error);
      res.status(500).json({ message: "Failed to fetch official updates" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const disasters = await storage.getDisasters();
      const reports = await storage.getReports();
      const resources = await storage.getResources();
      
      const stats = {
        activeDisasters: disasters.length,
        pendingReports: reports.filter(r => r.verificationStatus === 'pending').length,
        availableResources: resources.length
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
