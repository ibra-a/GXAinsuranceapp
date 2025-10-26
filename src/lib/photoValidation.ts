// Photo validation and metadata utilities

export interface PhotoMetadata {
  timestamp: Date;
  device_info?: string;
  file_size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface CapturedPhoto {
  blob: Blob;
  dataUrl: string;
  metadata: PhotoMetadata;
  angle: 'front' | 'rear' | 'left' | 'right';
  timestamp: Date;
  url?: string; // After upload to Supabase
}

/**
 * Check if photo was taken recently (within last 5 minutes)
 * This prevents users from uploading old photos
 */
export function isRecentPhoto(timestamp: Date): boolean {
  const now = Date.now();
  const photoTime = timestamp.getTime();
  const minutesSince = (now - photoTime) / (1000 * 60);
  
  // Must be within last 5 minutes
  return minutesSince <= 5;
}

/**
 * Validate that all photos were taken in the same session (within 30 minutes)
 */
export function validatePhotoSequence(photos: CapturedPhoto[]): boolean {
  if (photos.length < 4) return false;
  
  const timestamps = photos.map(p => p.timestamp.getTime());
  const earliest = Math.min(...timestamps);
  const latest = Math.max(...timestamps);
  const sessionDuration = (latest - earliest) / (1000 * 60);
  
  // All photos must be within 30 minutes
  return sessionDuration <= 30;
}

/**
 * Validate photo file size (max 10MB)
 */
export function isValidFileSize(blob: Blob): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return blob.size <= maxSize;
}

/**
 * Validate photo is an image
 */
export function isValidImageType(blob: Blob): boolean {
  return blob.type.startsWith('image/');
}

/**
 * Extract basic metadata from a photo blob
 */
export async function extractMetadata(blob: Blob): Promise<PhotoMetadata> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Create image to get dimensions
        const img = new Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          resolve({
            timestamp: new Date(), // Current time for live captures
            device_info: navigator.userAgent,
            file_size: blob.size,
            dimensions: {
              width: img.width,
              height: img.height
            }
          });
        };
        
        img.onerror = () => {
          // Fallback if image can't be loaded
          resolve({
            timestamp: new Date(),
            device_info: navigator.userAgent,
            file_size: blob.size
          });
        };
      } catch (error) {
        // Fallback metadata
        resolve({
          timestamp: new Date(),
          device_info: navigator.userAgent,
          file_size: blob.size
        });
      }
    };
    
    reader.readAsDataURL(blob);
  });
}

/**
 * Compress photo for faster upload
 * Reduces size while maintaining quality
 */
export async function compressPhoto(blob: Blob): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Max dimensions
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob || blob);
          },
          'image/jpeg',
          0.85 // Quality
        );
      };
    };
    
    reader.readAsDataURL(blob);
  });
}

/**
 * Format angle name for display
 */
export function formatAngleName(angle: string): string {
  return angle.charAt(0).toUpperCase() + angle.slice(1);
}

/**
 * Get instructions for capturing each angle
 */
export function getAngleInstructions(angle: 'front' | 'rear' | 'left' | 'right'): string[] {
  const instructions = {
    front: [
      'Position the entire front of the vehicle in frame',
      'Include the license plate clearly',
      'Show all visible damage to front bumper and hood',
      'Ensure good lighting - avoid shadows'
    ],
    rear: [
      'Position the entire rear of the vehicle in frame',
      'Include the license plate clearly',
      'Show all visible damage to rear bumper and trunk',
      'Capture from a slight angle to show depth'
    ],
    left: [
      'Capture the full driver side of the vehicle',
      'Include from front wheel to rear wheel',
      'Show all doors and any side damage',
      'Stand back to get the complete side view'
    ],
    right: [
      'Capture the full passenger side of the vehicle',
      'Include from front wheel to rear wheel',
      'Show all doors and any side damage',
      'Stand back to get the complete side view'
    ]
  };
  
  return instructions[angle];
}

