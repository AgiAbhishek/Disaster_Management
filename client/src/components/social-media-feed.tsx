import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import type { SocialMediaPost } from "@shared/schema";

export function SocialMediaFeed() {
  const { data: posts = [], isLoading } = useQuery<SocialMediaPost[]>({
    queryKey: ['/api/social-media'],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'official':
        return 'fas fa-check-circle';
      case 'priority':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fab fa-twitter';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Social Media Monitor</h2>
        </div>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
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
        <h2 className="text-lg font-semibold text-slate-900">Social Media Monitor</h2>
        <div className="flex items-center space-x-1 text-sm text-slate-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Feed</span>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-200">
        {posts.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            <i className="fas fa-info-circle text-2xl mb-2"></i>
            <p>No social media reports available</p>
          </div>
        ) : (
          posts.slice(0, 10).map((post) => (
            <div key={post.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className={`${getPriorityIcon(post.priority)} text-blue-600 text-sm`}></i>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">{post.content}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                    <span>{post.user}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    <Badge className={`priority-${post.priority} text-xs`}>
                      {post.priority === 'official' ? 'Official' : 
                       post.priority === 'priority' ? 'Priority' : 'Info'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
