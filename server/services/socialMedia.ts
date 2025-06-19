import { storage } from '../storage';
import { type InsertSocialMediaPost } from '@shared/schema';

export class SocialMediaService {
  private indianNewsPosts = [
    {
      content: "Mumbai: Heavy rainfall alert issued by IMD. Local trains on Central and Western lines running with delays. Citizens advised to avoid travel. #MumbaiRains #IMDAlert",
      user: "@IndianMetDept",
      platform: "twitter",
      priority: "official" as const
    },
    {
      content: "Delhi: Air quality reaches 'severe' category. Schools in NCR region may close tomorrow. Health advisory issued for outdoor activities. #DelhiPollution #AQI",
      user: "@CPCBOfficial",
      platform: "twitter",
      priority: "official" as const
    },
    {
      content: "Chennai: Cyclone warning for coastal Tamil Nadu. Fishermen advised not to venture into sea. NDRF teams deployed in vulnerable areas. #CycloneAlert #TamilNadu",
      user: "@ChennaiRains",
      platform: "twitter",
      priority: "priority" as const
    },
    {
      content: "Bangalore: Traffic congestion due to waterlogging at Electronic City. IT companies allowing work from home. Alternative routes via Hosur Road. #BangaloreTraffic",
      user: "@BlrTrafficInfo",
      platform: "twitter",
      priority: "normal" as const
    },
    {
      content: "Kolkata: Bridge inspection underway at Howrah Bridge. Vehicular movement restricted. Metro services extended hours to accommodate commuters. #KolkataTraffic",
      user: "@KolkataPolice",
      platform: "twitter",
      priority: "official" as const
    },
    {
      content: "URGENT: Fire incident at industrial area in Pune. Hazmat team deployed. Residents within 2km radius advised to stay indoors. #PuneEmergency #FireAlert",
      user: "@PuneFireDept",
      platform: "twitter",
      priority: "priority" as const
    },
    {
      content: "Hyderabad: Water shortage in several areas due to pipeline burst. Tanker services arranged. Repair work expected to complete by evening. #HyderabadWater",
      user: "@GHMCOnline",
      platform: "twitter",
      priority: "normal" as const
    },
    {
      content: "Ahmedabad: Heat wave continues with temperatures above 45°C. Cooling centers opened at community halls. Health advisory for elderly and children. #GujaratHeat",
      user: "@GujaratState",
      platform: "twitter",
      priority: "official" as const
    }
  ];

  async fetchSocialMediaReports(keywords: string[] = ["disaster", "emergency", "flood", "earthquake", "fire"]): Promise<void> {
    // Simulate fetching from Indian news and social media APIs
    // In production, this would integrate with Twitter API, News APIs, etc.
    
    const randomPost = this.indianNewsPosts[Math.floor(Math.random() * this.indianNewsPosts.length)];
    
    const post: InsertSocialMediaPost = {
      content: randomPost.content,
      user: randomPost.user,
      platform: randomPost.platform,
      priority: randomPost.priority
    };

    await storage.createSocialMediaPost(post);
  }

  async analyzePostPriority(content: string): Promise<string> {
    // Simple keyword-based priority classification
    const urgentKeywords = ["urgent", "sos", "help", "emergency", "stranded", "trapped"];
    const officialSources = ["@RedCross", "@FEMA", "@MTA", "@NYC", "@Emergency"];
    
    const lowerContent = content.toLowerCase();
    
    // Check if it's from an official source
    if (officialSources.some(source => content.includes(source))) {
      return "official";
    }
    
    // Check for urgent keywords
    if (urgentKeywords.some(keyword => lowerContent.includes(keyword))) {
      return "priority";
    }
    
    return "normal";
  }

  async startRealTimeMonitoring(): Promise<void> {
    // Simulate real-time monitoring by periodically adding new posts
    setInterval(async () => {
      try {
        await this.fetchSocialMediaReports();
      } catch (error) {
        console.error('Error in social media monitoring:', error);
      }
    }, 30000); // Every 30 seconds
  }
}

export const socialMediaService = new SocialMediaService();
