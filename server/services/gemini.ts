interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Location extraction and image verification will not work.');
    }
  }

  async extractLocation(description: string): Promise<string | null> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = `Extract the location name from this disaster description. Return only the location name (city, state/country format preferred) or "NONE" if no location is found: "${description}"`;
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const extractedText = data.candidates[0].content.parts[0].text.trim();
      
      if (extractedText.toUpperCase() === 'NONE' || !extractedText) {
        return null;
      }

      return extractedText;
    } catch (error) {
      console.error('Error extracting location:', error);
      throw error;
    }
  }

  async verifyImage(imageUrl: string): Promise<{ isAuthentic: boolean; confidence: string; analysis: string }> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = `Analyze this image URL for signs of manipulation or to verify if it shows authentic disaster damage. Consider factors like image consistency, lighting, shadows, and whether the damage appears realistic. Provide your assessment as: AUTHENTIC or SUSPICIOUS, followed by your confidence level (HIGH/MEDIUM/LOW), and a brief explanation. Image URL: ${imageUrl}`;
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini API');
      }

      const analysisText = data.candidates[0].content.parts[0].text.trim();
      
      // Parse the response
      const isAuthentic = analysisText.toUpperCase().includes('AUTHENTIC') && !analysisText.toUpperCase().includes('SUSPICIOUS');
      
      let confidence = 'MEDIUM';
      if (analysisText.toUpperCase().includes('HIGH')) confidence = 'HIGH';
      if (analysisText.toUpperCase().includes('LOW')) confidence = 'LOW';

      return {
        isAuthentic,
        confidence: confidence.toLowerCase(),
        analysis: analysisText
      };
    } catch (error) {
      console.error('Error verifying image:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
