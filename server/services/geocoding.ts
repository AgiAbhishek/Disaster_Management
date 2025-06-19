interface GeocodingResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export class GeocodingService {
  private googleApiKey: string;
  private mapboxApiKey: string;

  constructor() {
    this.googleApiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    this.mapboxApiKey = process.env.MAPBOX_API_KEY || '';
  }

  async geocodeLocation(locationName: string): Promise<GeocodingResult | null> {
    // Try Google Maps first
    if (this.googleApiKey) {
      try {
        return await this.geocodeWithGoogle(locationName);
      } catch (error) {
        console.warn('Google geocoding failed, trying Mapbox:', error);
      }
    }

    // Try Mapbox
    if (this.mapboxApiKey) {
      try {
        return await this.geocodeWithMapbox(locationName);
      } catch (error) {
        console.warn('Mapbox geocoding failed, trying OpenStreetMap:', error);
      }
    }

    // Fallback to OpenStreetMap (Nominatim)
    try {
      return await this.geocodeWithNominatim(locationName);
    } catch (error) {
      console.error('All geocoding services failed:', error);
      throw error;
    }
  }

  private async geocodeWithGoogle(locationName: string): Promise<GeocodingResult | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=${this.googleApiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      formattedAddress: result.formatted_address
    };
  }

  private async geocodeWithMapbox(locationName: string): Promise<GeocodingResult | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json?access_token=${this.mapboxApiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mapbox geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return null;
    }

    const result = data.features[0];
    return {
      latitude: result.center[1],
      longitude: result.center[0],
      formattedAddress: result.place_name
    };
  }

  private async geocodeWithNominatim(locationName: string): Promise<GeocodingResult | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Disaster-Response-Platform/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Nominatim geocoding API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return null;
    }

    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formattedAddress: result.display_name
    };
  }
}

export const geocodingService = new GeocodingService();
