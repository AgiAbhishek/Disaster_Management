import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertDisasterSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
      locationName: "",
      description: "",
      tags: [],
      ownerId: "netrunnerX",
      latitude: undefined,
      longitude: undefined
    }
  });

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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Manhattan, NYC" {...field} />
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
