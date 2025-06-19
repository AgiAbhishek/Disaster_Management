import { storage } from '../storage';
import { type InsertSocialMediaPost } from '@shared/schema';

export class SocialMediaService {
  private mockPosts = [
    {
      content: "#floodrelief Need food and water in Lower East Side. Multiple families affected. #NYC #emergency",
      user: "@citizen_reporter",
      platform: "twitter",
      priority: "priority" as const
    },
    {
      content: "Red Cross shelter open at PS 123 Brooklyn Heights. Hot meals and temporary housing available. #DisasterRelief",
      user: "@RedCrossNY", 
      platform: "twitter",
      priority: "official" as const
    },
    {
      content: "Subway lines 4,5,6 suspended due to flooding. Use alternate routes. Updates at mta.info #MTAAlert",
      user: "@MTA",
      platform: "twitter", 
      priority: "official" as const
    },
    {
      content: "Volunteers needed at Brooklyn Community Center for flood relief efforts. Bring supplies if possible. #volunteer #help",
      user: "@BrooklynRelief",
      platform: "twitter",
      priority: "normal" as const
    },
    {
      content: "URGENT: Elderly residents stranded in apartment building on Houston Street. Need immediate assistance! #SOS #emergency",
      user: "@LocalCitizen", 
      platform: "twitter",
      priority: "priority" as const
    }
  ];

  async fetchSocialMediaReports(keywords: string[] = ["disaster", "emergency", "flood", "earthquake", "fire"]): Promise<void> {
    // Simulate fetching from social media APIs
    // In a real implementation, this would call Twitter API, Bluesky API, etc.
    
    // For now, randomly add mock posts to simulate real-time updates
    const randomPost = this.mockPosts[Math.floor(Math.random() * this.mockPosts.length)];
    
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
