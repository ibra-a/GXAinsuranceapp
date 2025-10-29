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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Camera view fills entire viewport - Native camera app style */}
      <div className="relative w-full h-full">
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
            
            {/* Top overlay - Header & Instructions */}
            {!cameraError && (
              <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/50 to-transparent pt-safe">
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      📸 {formatAngleName(angle)} View
                    </h3>
                    <p className="text-xs text-white/80">
                      Photo {['front', 'rear', 'left', 'right'].indexOf(angle) + 1} of 4
                    </p>
                  </div>
                  
                  {/* Compact Instructions */}
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-white/20 rounded-lg p-2">
                    <ul className="space-y-1 text-xs text-white">
                      {instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-1.5">
                          <span className="font-bold text-blue-300 mt-0.5">{index + 1}.</span>
                          <span className="leading-tight">{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Camera guide frame overlay */}
            {!cameraError && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-8 border-2 border-white/50 border-dashed rounded-lg" />
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
            <div className="absolute top-8 right-8">
              <CheckCircle className="h-16 w-16 text-green-500 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        )}

        {/* Bottom controls - Fixed at bottom like native camera */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/70 to-transparent pb-safe">
          {!captured ? (
            <div className="flex flex-col items-center py-8 px-4 space-y-4">
              {/* Main capture button */}
              {!cameraError && (
                <>
                  <button
                    onClick={capturePhoto}
                    disabled={uploading}
                    className="w-20 h-20 rounded-full bg-white border-4 border-blue-500 shadow-2xl hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Take photo"
                  >
                    {uploading ? (
                      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-600" />
                    )}
                  </button>
                  
                  <p className="text-xs text-white/80 text-center">
                    Tap to capture
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex gap-3 p-4">
              <Button
                onClick={handleRetake}
                variant="outline"
                size="lg"
                className="flex-1 h-14 text-base bg-white/90 hover:bg-white"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Retake
              </Button>
              <Button
                onClick={() => onCapture(captured)}
                size="lg"
                className="flex-1 h-14 text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Continue
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

