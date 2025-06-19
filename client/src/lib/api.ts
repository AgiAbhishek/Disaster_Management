import { apiRequest } from './queryClient';

// API helper functions for disaster response platform

export const api = {
  // Disasters
  disasters: {
    getAll: (filters?: { tag?: string; owner?: string }) => {
      const params = new URLSearchParams();
      if (filters?.tag) params.append('tag', filters.tag);
      if (filters?.owner) params.append('owner', filters.owner);
      const query = params.toString() ? `?${params.toString()}` : '';
      return fetch(`/api/disasters${query}`).then(res => res.json());
    },
    
    getById: (id: number) => 
      fetch(`/api/disasters/${id}`).then(res => res.json()),
    
    create: (data: any) => 
      apiRequest('POST', '/api/disasters', data).then(res => res.json()),
    
    update: (id: number, data: any) => 
      apiRequest('PUT', `/api/disasters/${id}`, data).then(res => res.json()),
    
    delete: (id: number) => 
      apiRequest('DELETE', `/api/disasters/${id}`)
  },

  // Geocoding
  geocode: (locationName?: string, description?: string) => 
    apiRequest('POST', '/api/geocode', { locationName, description }).then(res => res.json()),

  // Social Media
  socialMedia: {
    getAll: () => 
      fetch('/api/social-media').then(res => res.json()),
    
    getByDisaster: (disasterId: number) => 
      fetch(`/api/disasters/${disasterId}/social-media`).then(res => res.json())
  },

  // Resources
  resources: {
    getAll: () => 
      fetch('/api/resources').then(res => res.json()),
    
    getNearby: (lat: number, lon: number, radius: number = 10) => 
      fetch(`/api/resources?lat=${lat}&lon=${lon}&radius=${radius}`).then(res => res.json()),
    
    getByDisaster: (disasterId: number, lat?: number, lon?: number, radius?: number) => {
      const params = new URLSearchParams();
      if (lat) params.append('lat', lat.toString());
      if (lon) params.append('lon', lon.toString());
      if (radius) params.append('radius', radius.toString());
      const query = params.toString() ? `?${params.toString()}` : '';
      return fetch(`/api/disasters/${disasterId}/resources${query}`).then(res => res.json());
    },
    
    create: (data: any) => 
      apiRequest('POST', '/api/resources', data).then(res => res.json())
  },

  // Reports
  reports: {
    getAll: (disasterId?: number) => {
      const params = disasterId ? `?disasterId=${disasterId}` : '';
      return fetch(`/api/reports${params}`).then(res => res.json());
    },
    
    create: (data: any) => 
      apiRequest('POST', '/api/reports', data).then(res => res.json())
  },

  // Image Verification
  verifyImage: (disasterId: number, imageUrl: string) => 
    apiRequest('POST', `/api/disasters/${disasterId}/verify-image`, { imageUrl }).then(res => res.json()),

  // Official Updates
  getOfficialUpdates: (disasterId: number) => 
    fetch(`/api/disasters/${disasterId}/official-updates`).then(res => res.json()),

  // Stats
  getStats: () => 
    fetch('/api/stats').then(res => res.json())
};
