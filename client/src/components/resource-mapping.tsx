import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@shared/schema";

export function ResourceMapping() {
  const [lat, setLat] = useState("40.7128");
  const [lon, setLon] = useState("-74.0060");
  const [radius, setRadius] = useState("10");
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: resources = [], isLoading, refetch } = useQuery<Resource[]>({
    queryKey: ['/api/resources', lat, lon, radius],
    queryFn: async () => {
      const response = await fetch(`/api/resources?lat=${lat}&lon=${lon}&radius=${radius}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return response.json();
    },
    enabled: searchTriggered, // Only run when search is triggered
  });

  const handleSearch = () => {
    setSearchTriggered(true);
    refetch();
  };

  const calculateDistance = (resource: Resource) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (resource.latitude - parseFloat(lat)) * Math.PI / 180;
    const dLon = (resource.longitude - parseFloat(lon)) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(parseFloat(lat) * Math.PI / 180) * Math.cos(resource.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'shelter':
        return 'fas fa-home';
      case 'hospital':
        return 'fas fa-hospital';
      case 'food':
        return 'fas fa-utensils';
      default:
        return 'fas fa-map-marker-alt';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Nearby Resources</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <label className="text-slate-700 w-16">Location:</label>
            <Input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="flex-1 text-xs font-mono"
              placeholder="Latitude"
            />
            <Input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="flex-1 text-xs font-mono"
              placeholder="Longitude"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <label className="text-slate-700 w-16">Radius:</label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5km</SelectItem>
                <SelectItem value="10">10km</SelectItem>
                <SelectItem value="25">25km</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1"></i>
                  Searching...
                </>
              ) : (
                <>
                  <i className="fas fa-search mr-1"></i>
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {!searchTriggered ? (
            <div className="text-center text-slate-500 py-4">
              <i className="fas fa-search text-2xl mb-2"></i>
              <p>Click search to find nearby resources</p>
            </div>
          ) : isLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                  <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center text-slate-500 py-4">
              <i className="fas fa-info-circle text-2xl mb-2"></i>
              <p>No resources found in this area</p>
            </div>
          ) : (
            resources.map((resource) => (
              <div key={resource.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    resource.type === 'shelter' ? 'bg-green-100' :
                    resource.type === 'hospital' ? 'bg-blue-100' :
                    resource.type === 'food' ? 'bg-yellow-100' : 'bg-slate-100'
                  }`}>
                    <i className={`${getResourceIcon(resource.type)} text-sm ${
                      resource.type === 'shelter' ? 'text-green-600' :
                      resource.type === 'hospital' ? 'text-blue-600' :
                      resource.type === 'food' ? 'text-yellow-600' : 'text-slate-600'
                    }`}></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{resource.name}</p>
                  <p className="text-xs text-slate-600">{resource.locationName}</p>
                  <p className="text-xs text-slate-500 font-mono">Distance: {calculateDistance(resource)}km</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge className={`resource-${resource.type} text-xs`}>
                    {resource.type}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
