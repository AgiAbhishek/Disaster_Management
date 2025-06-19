import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VerificationResult {
  isAuthentic: boolean;
  confidence: string;
  analysis: string;
}

export function ImageVerification() {
  const [imageUrl, setImageUrl] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const verifyImageMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/disasters/1/verify-image", { imageUrl: url });
      return response.json();
    },
    onSuccess: (data: VerificationResult) => {
      setVerificationResult(data);
      toast({
        title: "Verification Complete",
        description: `Image appears ${data.isAuthentic ? 'authentic' : 'suspicious'}`,
        variant: data.isAuthentic ? "default" : "destructive"
      });
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleVerify = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive"
      });
      return;
    }

    try {
      new URL(imageUrl); // Validate URL
      verifyImageMutation.mutate(imageUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Image Verification</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image URL
            </label>
            <div className="flex space-x-2">
              <Input
                type="url"
                placeholder="https://example.com/disaster-image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleVerify}
                disabled={verifyImageMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {verifyImageMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>

          {verificationResult && (
            <div className={`p-4 rounded-lg border ${
              verificationResult.isAuthentic 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start space-x-3">
                <i className={`${
                  verificationResult.isAuthentic 
                    ? 'fas fa-check-circle text-green-600' 
                    : 'fas fa-exclamation-triangle text-red-600'
                } mt-1`}></i>
                <div>
                  <p className={`font-medium ${
                    verificationResult.isAuthentic ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {verificationResult.isAuthentic ? 'Image Appears Authentic' : 'Image Suspicious'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    verificationResult.isAuthentic ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Confidence: {verificationResult.confidence.toUpperCase()}
                  </p>
                  <p className={`text-sm mt-2 ${
                    verificationResult.isAuthentic ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {verificationResult.analysis}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <i className="fas fa-cloud-upload-alt text-4xl text-slate-400 mb-4"></i>
            <p className="text-slate-600 mb-2">Upload disaster images for AI verification</p>
            <p className="text-xs text-slate-500">
              Note: File upload functionality requires additional implementation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
