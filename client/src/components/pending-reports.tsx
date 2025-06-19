import { useQuery } from "@tanstack/react-query";

interface Report {
  id: number;
  content: string;
  createdAt: string;
  userId: string;
  imageUrl: string | null;
  verificationStatus: string;
  disasterId: number;
}

export function PendingReports() {
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const pendingReports = reports?.filter(report => report.verificationStatus === 'pending') || [];

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const reportTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - reportTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Pending Reports</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
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
        <h2 className="text-lg font-semibold text-slate-900">
          Pending Reports
          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            {pendingReports.length}
          </span>
        </h2>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Awaiting Review</span>
        </div>
      </div>
      
      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {pendingReports.map((report) => (
          <div key={report.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {report.imageUrl ? (
                  <img
                    src={report.imageUrl}
                    alt="Report evidence"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-file-text text-slate-400"></i>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(report.verificationStatus)}`}>
                    {report.verificationStatus.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    Report #{report.id} • {formatTimeAgo(report.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2 mb-2">{report.content}</p>
                <div className="flex items-center text-xs text-slate-500 space-x-4">
                  <span>
                    <i className="fas fa-user mr-1"></i>
                    {report.userId}
                  </span>
                  <span>
                    <i className="fas fa-exclamation-triangle mr-1"></i>
                    Disaster #{report.disasterId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {pendingReports.length === 0 && !isLoading && (
          <div className="p-8 text-center text-slate-500">
            <i className="fas fa-check-circle text-3xl mb-3 text-green-500"></i>
            <h3 className="text-sm font-medium text-slate-700 mb-1">All reports reviewed</h3>
            <p className="text-xs">No pending reports require verification at this time</p>
          </div>
        )}
      </div>
    </div>
  );
}