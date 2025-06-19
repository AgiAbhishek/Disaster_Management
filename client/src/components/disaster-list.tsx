import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Disaster } from "@shared/schema";

export function DisasterList() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: disasters = [], isLoading } = useQuery<Disaster[]>({
    queryKey: ['/api/disasters', selectedTag],
    queryFn: async () => {
      const url = selectedTag && selectedTag !== "all" ? `/api/disasters?tag=${selectedTag}` : '/api/disasters';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch disasters');
      return response.json();
    },
  });

  const deleteDisasterMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/disasters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/disasters'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      toast({
        title: "Success",
        description: "Disaster deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const disasterDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - disasterDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Active Disasters</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Active Disasters</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="flood">Flood</SelectItem>
              <SelectItem value="earthquake">Earthquake</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="divide-y divide-slate-200">
        {disasters.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <i className="fas fa-info-circle text-2xl mb-2"></i>
            <p>No disasters found{selectedTag ? ` with tag "${selectedTag}"` : ''}.</p>
          </div>
        ) : (
          disasters.map((disaster) => (
            <div key={disaster.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-slate-900">{disaster.title}</h3>
                    <div className="flex space-x-2">
                      {disaster.tags.map((tag) => (
                        <Badge
                          key={tag}
                          className={`disaster-tag disaster-tag-${tag}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 mt-1">{disaster.locationName}</p>
                  <p className="text-slate-700 mt-2">{disaster.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
                    <span>
                      <i className="fas fa-user mr-1"></i>
                      {disaster.ownerId}
                    </span>
                    <span>
                      <i className="fas fa-clock mr-1"></i>
                      {formatTimeAgo(disaster.createdAt)}
                    </span>
                    {disaster.latitude && disaster.longitude && (
                      <span>
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {disaster.latitude.toFixed(4)}, {disaster.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="View Details"
                  >
                    <i className="fas fa-eye"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDisasterMutation.mutate(disaster.id)}
                    disabled={deleteDisasterMutation.isPending}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
