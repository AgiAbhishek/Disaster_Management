import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertDisasterSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const INDIAN_CITIES = {
  "Mumbai": { lat: 19.0596, lon: 72.8295 },
  "Delhi": { lat: 28.5672, lon: 77.2100 },
  "Chennai": { lat: 13.0181, lon: 80.2358 },
  "Bangalore": { lat: 12.8456, lon: 77.6603 },
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Lucknow": { lat: 26.8467, lon: 80.9462 }
};

const formSchema = insertDisasterSchema.extend({
  tags: z.array(z.string()).default([])
});

type FormData = z.infer<typeof formSchema>;

export function DisasterForm() {
  const [newTag, setNewTag] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      locationName: "Mumbai",
      description: "",
      tags: [],
      ownerId: "netrunnerX",
      latitude: 19.0596,
      longitude: 72.8295
    }
  });

  const handleCityChange = (city: string) => {
    const coords = INDIAN_CITIES[city as keyof typeof INDIAN_CITIES];
    if (coords) {
      form.setValue("locationName", city);
      form.setValue("latitude", coords.lat);
      form.setValue("longitude", coords.lon);
    }
  };

  const createDisasterMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/disasters", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/disasters'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      form.reset();
      toast({
        title: "Success",
        description: "Disaster record created successfully",
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

  const extractLocationMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await apiRequest("POST", "/api/geocode", { description });
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue("locationName", data.locationName);
      form.setValue("latitude", data.latitude);
      form.setValue("longitude", data.longitude);
      toast({
        title: "Location Extracted",
        description: `Found: ${data.locationName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Extraction Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FormData) => {
    createDisasterMutation.mutate(data);
  };

  const handleExtractLocation = async () => {
    const description = form.getValues("description");
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description first",
        variant: "destructive"
      });
      return;
    }
    
    setIsExtracting(true);
    try {
      await extractLocationMutation.mutateAsync(description);
    } finally {
      setIsExtracting(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !form.getValues("tags").includes(tag)) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, tag]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const watchedTags = form.watch("tags");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Report New Disaster</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., NYC Flood Emergency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={(value) => {
                      field.onChange(value);
                      handleCityChange(value);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(INDIAN_CITIES).map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={3} 
                    placeholder="Detailed description of the disaster situation..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Tags</FormLabel>
            <div className="flex flex-wrap gap-2 mb-2 mt-2">
              {watchedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`disaster-tag disaster-tag-${tag}`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-xs hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(newTag);
                    }
                  }}
                  className="w-24 h-8 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addTag(newTag)}
                >
                  <i className="fas fa-plus text-xs"></i>
                </Button>
              </div>
            </div>
            <div className="flex space-x-2">
              {['flood', 'fire', 'earthquake', 'urgent'].map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addTag(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={createDisasterMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createDisasterMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2"></i>
                  Create Disaster Record
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleExtractLocation}
              disabled={isExtracting || extractLocationMutation.isPending}
            >
              {isExtracting || extractLocationMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Extracting...
                </>
              ) : (
                <>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Extract Location
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
