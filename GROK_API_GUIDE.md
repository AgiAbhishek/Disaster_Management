# Grok API Integration Guide & Image Verification

## Current Grok API Implementation

The disaster response platform integrates Grok AI for three key features:

### 1. Location Extraction (`server/services/grok.ts`)
**Purpose:** Automatically extract location names from disaster descriptions
**Usage:** When you describe a disaster, Grok identifies the location

**Example:**
```
Description: "Heavy flooding in Mumbai near CST station"
Grok Output: "Mumbai"
```

### 2. Image Verification (`/api/verify-image`)
**Purpose:** Analyze uploaded images to verify authenticity for disaster reports
**How to Use:**

1. **Via Dashboard:** Go to "Image Verification" tab
2. **Submit Image URL:** Paste any image URL (e.g., from news sites)
3. **Get Analysis:** Grok analyzes and provides:
   - Authenticity score
   - Confidence level
   - Detailed analysis

**API Endpoint:**
```bash
curl -X POST http://localhost:5000/api/verify-image \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/disaster-image.jpg"}'
```

**Response:**
```json
{
  "isAuthentic": true,
  "confidence": "85%",
  "analysis": "Image shows genuine flood damage with consistent lighting and perspective. No signs of digital manipulation detected."
}
```

### 3. Sentiment Analysis for Priority Classification
**Purpose:** Automatically classify social media posts and reports by urgency
**Usage:** Analyzes text content to determine priority levels

## How to Test Image Verification

1. **Open Dashboard:** Navigate to "Image Verification" section
2. **Test URLs:** Use these sample disaster image URLs:
   - `https://example.com/flood-damage.jpg`
   - `https://example.com/fire-emergency.jpg`
   - `https://example.com/earthquake-damage.jpg`

3. **Expected Output:**
   - Authenticity assessment
   - Confidence percentage
   - Detailed analysis of image elements

## API Key Configuration

The Grok API key is configured in `server/services/grok.ts`:
```typescript
const openai = new OpenAI({ 
  baseURL: "https://api.x.ai/v1", 
  apiKey: "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"
});
```

## Social Media Intelligence

The system uses Grok to:
- Analyze social media content priority
- Extract location information from posts
- Classify emergency vs. non-emergency content

## Production Integration Points

1. **Real-time News Feeds:** Connect to Indian news APIs
2. **Social Media Monitoring:** Twitter API, Telegram channels
3. **Government Alerts:** IMD, NDRF official channels
4. **Emergency Services:** 108, Fire Department feeds

## Troubleshooting

If image verification shows "API key issues":
1. The system falls back to pattern-based analysis
2. Basic authenticity checks still function
3. Request valid API key for full AI features

## Current Status

- ✅ Location extraction working with fallback patterns
- ✅ Image verification endpoint functional
- ✅ Social media monitoring with Indian news feeds
- ✅ Sentiment analysis for priority classification
- ⚠️ API key validation needed for full AI capabilities