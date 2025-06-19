import { useQuery } from "@tanstack/react-query";

interface Resource {
  id: number;
  name: string;
  type: string;
  locationName: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  disasterId: number | null;
}

export function AvailableResources() {
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
    refetchInterval: 60000, // Refetch every minute
  });

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const resourceTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - resourceTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getResourceIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'hospital':
        return 'fas fa-hospital text-red-600';
      case 'shelter':
        return 'fas fa-home text-blue-600';
      case 'food center':
        return 'fas fa-utensils text-green-600';
      case 'evacuation center':
        return 'fas fa-map-marker-alt text-purple-600';
      case 'relief camp':
        return 'fas fa-campground text-orange-600';
      default:
        return 'fas fa-map-marker-alt text-gray-600';
    }
  };

  const getResourceBadge = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'hospital':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'shelter':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'food center':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'evacuation center':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'relief camp':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Available Resources</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const groupedResources = resources?.reduce((acc, resource) => {
    const type = resource.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>) || {};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Available Resources
          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            {resources?.length || 0}
          </span>
        </h2>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Status</span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedResources).map(([type, typeResources]) => (
          <div key={type} className="border-b border-slate-100 last:border-b-0">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <i className={`${getResourceIcon(type)} text-sm`}></i>
                <h3 className="text-sm font-medium text-slate-700 capitalize">
                  {type} ({typeResources.length})
                </h3>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100">
              {typeResources.map((resource) => (
                <div key={resource.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <i className={`${getResourceIcon(resource.type)} text-sm`}></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-900 truncate">
                          {resource.name}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getResourceBadge(resource.type)}`}>
                          {resource.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {resource.locationName}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 space-x-4">
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          Added {formatTimeAgo(resource.createdAt)}
                        </span>
                        <span>
                          <i className="fas fa-id-badge mr-1"></i>
                          ID: {resource.id}
                        </span>
                        {resource.disasterId && (
                          <span>
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Disaster #{resource.disasterId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {(!resources || resources.length === 0) && !isLoading && (
          <div className="p-8 text-center text-slate-500">
            <i className="fas fa-map-marker-alt text-3xl mb-3 text-gray-400"></i>
            <h3 className="text-sm font-medium text-slate-700 mb-1">No resources available</h3>
            <p className="text-xs">Resources will appear here when they are added to the system</p>
          </div>
        )}
      </div>
    </div>
  );
}