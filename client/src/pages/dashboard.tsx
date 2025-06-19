import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { DisasterForm } from "@/components/disaster-form";
import { DisasterList } from "@/components/disaster-list";
import { SocialMediaFeed } from "@/components/social-media-feed";
import { ResourceMapping } from "@/components/resource-mapping";
import { ImageVerification } from "@/components/image-verification";
import { ReportForm } from "@/components/report-form";
import { OfficialUpdates } from "@/components/official-updates";
import { PendingReports } from "@/components/pending-reports";
import { AvailableResources } from "@/components/available-resources";

export default function Dashboard() {
  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 30000 * 6, // Refetch every 3 minutes
  });

  // Connect to WebSocket for real-time updates
  const { isConnected } = useWebSocket();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-shield-alt text-blue-600 text-2xl"></i>
                <h1 className="text-xl font-bold text-slate-900">Disaster Response Hub</h1>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-slate-600">{isConnected ? 'Live' : 'Offline'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                <span>netrunnerX</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2">Admin</span>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fas fa-user-circle text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <i className="fas fa-exclamation-triangle text-red-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Active Disasters</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.activeDisasters || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <i className="fas fa-clock text-yellow-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Pending Reports</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.pendingReports || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <i className="fas fa-home text-green-600"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Available Resources</p>
                    <p className="text-2xl font-bold text-slate-900">{stats?.availableResources || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Disaster Creation Form */}
            <DisasterForm />

            {/* Disaster List */}
            <DisasterList />

            {/* Image Verification Section */}
            <ImageVerification />

            {/* Pending Reports Section */}
            <PendingReports />

            {/* Available Resources Section */}
            <AvailableResources />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Social Media Feed */}
            <SocialMediaFeed />

            {/* Resource Mapping */}
            <ResourceMapping />

            {/* Official Updates */}
            <OfficialUpdates />

            {/* Report Form */}
            <ReportForm />
          </div>
        </div>
      </div>
    </div>
  );
}
