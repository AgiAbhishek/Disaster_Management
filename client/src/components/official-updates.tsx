import { useQuery } from "@tanstack/react-query";

interface OfficialUpdate {
  source: string;
  content: string;
  timestamp: string;
  icon: string;
}

export function OfficialUpdates() {
  const { data: updates, isLoading } = useQuery<OfficialUpdate[]>({
    queryKey: ['/api/disasters/1/official-updates'],
    refetchInterval: 60000, // Refetch every minute for fresh updates
  });

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - updateTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getIconColor = (icon: string): string => {
    if (icon.includes('shield')) return 'bg-red-100 text-red-600';
    if (icon.includes('cloud')) return 'bg-blue-100 text-blue-600';
    if (icon.includes('university')) return 'bg-purple-100 text-purple-600';
    if (icon.includes('building')) return 'bg-green-100 text-green-600';
    if (icon.includes('water')) return 'bg-cyan-100 text-cyan-600';
    if (icon.includes('train')) return 'bg-orange-100 text-orange-600';
    return 'bg-gray-100 text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Official Updates</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Official Updates</h2>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Feed</span>
        </div>
      </div>
      
      <div className="divide-y divide-slate-200">
        {updates?.map((update, index) => (
          <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(update.icon)}`}>
                  <i className={`${update.icon} text-sm`}></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{update.source}</p>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{update.content}</p>
                <p className="text-xs text-slate-500 mt-2">{formatTimeAgo(update.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
        
        {(!updates || updates.length === 0) && !isLoading && (
          <div className="p-6 text-center text-slate-500">
            <i className="fas fa-info-circle text-2xl mb-2"></i>
            <p className="text-sm">No official updates available at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}