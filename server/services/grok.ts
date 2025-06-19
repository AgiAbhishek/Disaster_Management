import OpenAI from "openai";

const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: "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"
});

export class GrokService {
  private apiKey: string;

  constructor() {
    this.apiKey = "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";
    console.log('Grok API service initialized successfully');
  }

  async extractLocation(description: string): Promise<string | null> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    try {
      const prompt = `Extract the specific location name from this disaster description. Return only the location name (city, neighborhood, or landmark) or "NONE" if no clear location is mentioned: "${description}"`;
      
      const response = await openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.1
      });

      const extractedText = response.choices[0].message.content?.trim();
      
      if (!extractedText || extractedText.toUpperCase() === 'NONE') {
        return null;
      }

      console.log(`Grok extracted location: "${extractedText}" from "${description}"`);
      return extractedText;
    } catch (error) {
      console.error('Error extracting location with Grok:', error);
      throw error;
    }
  }

  async verifyImage(imageUrl: string): Promise<{ isAuthentic: boolean; confidence: string; analysis: string }> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    try {
      const prompt = `Analyze this image URL for signs of manipulation or to verify if it shows authentic disaster damage. Consider image consistency, lighting, and realism. Respond with JSON format: {"isAuthentic": true/false, "confidence": "HIGH/MEDIUM/LOW", "analysis": "brief explanation"}. Image URL: ${imageUrl}`;
      
      const response = await openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        isAuthentic: result.isAuthentic || false,
        confidence: result.confidence || 'LOW',
        analysis: result.analysis || 'Unable to analyze image'
      };
    } catch (error) {
      console.error('Error verifying image with Grok:', error);
      // Return safe fallback
      return {
        isAuthentic: false,
        confidence: 'LOW',
        analysis: 'Image verification failed - manual review required'
      };
    }
  }

  async analyzeSentiment(text: string): Promise<{ priority: string; urgency: number; reasoning: string }> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    try {
      const prompt = `Analyze this disaster-related text for urgency and priority. Rate urgency from 1-10 and assign priority (LOW/MEDIUM/HIGH/CRITICAL). Respond in JSON: {"priority": "HIGH", "urgency": 8, "reasoning": "explanation"}. Text: "${text}"`;
      
      const response = await openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        priority: result.priority || 'MEDIUM',
        urgency: Math.max(1, Math.min(10, result.urgency || 5)),
        reasoning: result.reasoning || 'Unable to analyze priority'
      };
    } catch (error) {
      console.error('Error analyzing sentiment with Grok:', error);
      return {
        priority: 'MEDIUM',
        urgency: 5,
        reasoning: 'Analysis failed - default priority assigned'
      };
    }
  }

  async summarizeReport(content: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Grok API key not configured');
    }

    try {
      const prompt = `Summarize this disaster report in one concise sentence focusing on key facts: "${content}"`;
      
      const response = await openai.chat.completions.create({
        model: "grok-beta",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.1
      });

      return response.choices[0].message.content?.trim() || content.substring(0, 100) + '...';
    } catch (error) {
      console.error('Error summarizing with Grok:', error);
      return content.substring(0, 100) + '...';
    }
  }
}

export const grokService = new GrokService();