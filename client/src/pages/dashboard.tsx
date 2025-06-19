import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { DisasterForm } from "@/components/disaster-form";
import { DisasterList } from "@/components/disaster-list";
import { SocialMediaFeed } from "@/components/social-media-feed";
import { ResourceMapping } from "@/components/resource-mapping";
import { ImageVerification } from "@/components/image-verification";
import { ReportForm } from "@/components/report-form";

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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Social Media Feed */}
            <SocialMediaFeed />

            {/* Resource Mapping */}
            <ResourceMapping />

            {/* Official Updates */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Official Updates</h2>
              </div>
              
              <div className="divide-y divide-slate-200">
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-university text-red-600 text-sm"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">FEMA</p>
                      <p className="text-sm text-slate-700 mt-1">Emergency shelters activated across NYC. Federal assistance approved for affected areas.</p>
                      <p className="text-xs text-slate-500 mt-2">15 minutes ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-building text-blue-600 text-sm"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">NYC Emergency Management</p>
                      <p className="text-sm text-slate-700 mt-1">Flash flood warning extended until 11 PM. Avoid unnecessary travel in affected areas.</p>
                      <p className="text-xs text-slate-500 mt-2">32 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Form */}
            <ReportForm />
          </div>
        </div>
      </div>
    </div>
  );
}
