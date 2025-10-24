import { useParams } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import { UploadCloud, Loader2, CheckCircle, XCircle, Info, FileVideo2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

function AdminUpload() {
  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); // Reset form after successful upload
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/5 via-blue-400/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-900/5 via-indigo-400/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Card className="relative z-10 w-full max-w-lg bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <UploadCloud className="w-7 h-7 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Upload Solution Video</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="videoFile" className="text-zinc-300 font-medium">
                Choose video file
              </Label>
              <Input
                id="videoFile"
                type="file"
                accept="video/*"
                {...register('videoFile', {
                  required: 'Please select a video file',
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0]) return 'Please select a video file';
                      const file = files[0];
                      return file.type.startsWith('video/') || 'Please select a valid video file';
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      const file = files[0];
                      const maxSize = 100 * 1024 * 1024; // 100MB
                      return file.size <= maxSize || 'File size must be less than 100MB';
                    },
                  },
                })}
                className={`bg-zinc-900/50 border-zinc-700 text-white file:bg-indigo-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4 file:font-medium hover:file:bg-indigo-500 ${
                  errors.videoFile ? 'border-red-500' : ''
                }`}
                disabled={uploading}
              />
              {errors.videoFile && (
                <p className="flex items-center gap-1 text-red-400 text-sm mt-1">
                  <XCircle className="w-4 h-4" />
                  {errors.videoFile.message}
                </p>
              )}
            </div>

            {/* Selected File Info */}
            {selectedFile && (
              <Alert className="bg-zinc-700/50 border-zinc-600/50">
                <FileVideo2 className="w-5 h-5 text-indigo-400" />
                <AlertDescription className="text-white">
                  <div className="font-semibold">Selected File:</div>
                  <div className="text-sm text-zinc-300">{selectedFile.name}</div>
                  <div className="text-sm text-zinc-400">Size: {formatFileSize(selectedFile.size)}</div>
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.root && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <XCircle className="w-5 h-5 text-red-400" />
                <AlertDescription className="text-red-400">{errors.root.message}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {uploadedVideo && (
              <Alert className="bg-emerald-500/10 border-emerald-500/30">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <AlertDescription className="text-emerald-400">
                  <div className="font-semibold">Upload Successful!</div>
                  <div className="text-sm">
                    Duration: {formatDuration(uploadedVideo.duration)} | Uploaded:{' '}
                    {new Date(uploadedVideo.uploadedAt).toLocaleString()}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={uploading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg"
              >
                {uploading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                {uploading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </div>
          </form>

          <div className="mt-6 flex items-center gap-2 text-zinc-400 text-xs">
            <Info className="w-4 h-4" />
            Only mp4/webm/avi and other common video formats supported. Max size: 100MB
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminUpload;
