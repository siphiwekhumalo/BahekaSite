import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequestTyped } from '@/lib/queryClient';
import { awsClientUtils, getApiEndpoint } from '@/lib/aws-config';
import { useToast } from '@/hooks/use-toast';

interface UploadResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  fileName: string;
}

interface UseFileUploadOptions {
  folder?: string;
  onSuccess?: (response: UploadResponse) => void;
  onError?: (error: string) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const { folder = 'uploads', onSuccess, onError } = options;
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Get presigned URL mutation
  const getPresignedUrlMutation = useMutation({
    mutationFn: async (file: File) => {
      return apiRequestTyped<UploadResponse>({
        url: getApiEndpoint('/upload'),
        method: 'POST',
        body: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder,
        },
      });
    },
  });

  // Upload file to S3
  const uploadToS3 = useCallback(async (file: File, presignedUrl: string) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }, []);

  // Main upload function
  const uploadFile = useCallback(async (file: File) => {
    try {
      // Validate file
      const validation = awsClientUtils.validateFile(file);
      if (!validation.valid) {
        const errorMessage = validation.error || 'Invalid file';
        onError?.(errorMessage);
        toast({
          title: 'Upload Error',
          description: errorMessage,
          variant: 'destructive',
        });
        return null;
      }

      // Reset progress
      setUploadProgress(0);

      // Get presigned URL
      const response = await getPresignedUrlMutation.mutateAsync(file);
      
      // Upload to S3
      await uploadToS3(file, response.uploadUrl);
      
      // Success
      setUploadProgress(100);
      onSuccess?.(response);
      
      toast({
        title: 'Upload Successful',
        description: `${file.name} has been uploaded successfully`,
      });

      return response;

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.message || 'Upload failed';
      onError?.(errorMessage);
      
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [getPresignedUrlMutation, uploadToS3, onSuccess, onError, toast, folder]);

  return {
    uploadFile,
    uploadProgress,
    isUploading: getPresignedUrlMutation.isPending,
    error: getPresignedUrlMutation.error,
  };
};