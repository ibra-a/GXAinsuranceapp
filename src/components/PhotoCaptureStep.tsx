import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Camera, RotateCcw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  extractMetadata,
  compressPhoto,
  isValidFileSize,
  formatAngleName,
  getAngleInstructions,
  type CapturedPhoto
} from '../lib/photoValidation';
import { uploadClaimPhoto } from '../lib/claims';

interface PhotoCaptureStepProps {
  angle: 'front' | 'rear' | 'left' | 'right';
  claimNumber: string;
  onCapture: (photo: CapturedPhoto) => void;
  existingPhoto?: CapturedPhoto;
}

export function PhotoCaptureStep({ 
  angle, 
  claimNumber,
  onCapture,
  existingPhoto 
}: PhotoCaptureStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<CapturedPhoto | null>(existingPhoto || null);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Start camera when component mounts
  useEffect(() => {
    if (!captured) {
      startCamera();
    }
    
    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [captured]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Enhanced mobile camera constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera on mobile
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Ensure video plays on iOS
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('autoplay', 'true');
        await videoRef.current.play();
      }
      
      setStream(mediaStream);
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please enable camera permissions in your browser settings.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Unable to access camera. Please try again.');
      }
      
      toast.error('Camera access failed');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      // Create canvas to capture current frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Failed to capture photo');
        return;
      }

      // Draw current video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0);

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to create photo');
          return;
        }

        // Validate file size
        if (!isValidFileSize(blob)) {
          toast.error('Photo is too large. Please try again.');
          return;
        }

        setUploading(true);

        try {
          // Compress photo
          const compressedBlob = await compressPhoto(blob);

          // Extract metadata
          const metadata = await extractMetadata(compressedBlob);

          // Create photo object
          const photo: CapturedPhoto = {
            blob: compressedBlob,
            dataUrl: canvas.toDataURL('image/jpeg', 0.85),
            metadata,
            angle,
            timestamp: new Date()
          };

          // Upload to Supabase immediately
          const url = await uploadClaimPhoto(compressedBlob, claimNumber, angle);

          if (url) {
            photo.url = url;
            setCaptured(photo);
            stopCamera();
            onCapture(photo);
            toast.success(`${formatAngleName(angle)} photo captured!`);
          } else {
            toast.error('Failed to upload photo. Please try again.');
          }
        } catch (error) {
          console.error('Photo processing error:', error);
          toast.error('Failed to process photo. Please try again.');
        } finally {
          setUploading(false);
        }
      }, 'image/jpeg', 0.85);
    } catch (error) {
      console.error('Capture error:', error);
      toast.error('Failed to capture photo');
    }
  };

  const handleRetake = () => {
    setCaptured(null);
    startCamera();
  };

  const instructions = getAngleInstructions(angle);

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          📸 Capture {formatAngleName(angle)} View
        </h3>
        <p className="text-gray-600">
          Photo {['front', 'rear', 'left', 'right'].indexOf(angle) + 1} of 4 required
        </p>
      </div>

      {/* Camera view or captured photo */}
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {!captured ? (
          <>
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <p className="text-white text-lg mb-4">{cameraError}</p>
                <Button onClick={startCamera} variant="outline" className="bg-white">
                  Try Again
                </Button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Camera overlay guide */}
            {!cameraError && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-lg" />
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                  Position vehicle {angle} in frame
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={captured.dataUrl}
              alt={`${formatAngleName(angle)} view`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <CheckCircle className="h-12 w-12 text-green-500 bg-white rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Instructions:
        </h4>
        <ul className="space-y-1 text-sm text-blue-800">
          {instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        {!captured ? (
          <>
            <Button
              onClick={capturePhoto}
              disabled={uploading || !!cameraError}
              size="lg"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Photo
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleRetake}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Retake
            </Button>
            <Button
              onClick={() => onCapture(captured)}
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Continue
            </Button>
          </>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-gray-500 text-center">
        💡 Tip: Hold your phone horizontally for best results
      </p>
    </Card>
  );
}

