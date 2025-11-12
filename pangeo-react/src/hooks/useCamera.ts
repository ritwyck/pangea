import { useRef, useState, useCallback } from 'react';
import type { UseCameraReturn } from '../types';

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const isReady = useCallback(() => {
    return isActive && stream && videoRef.current && videoRef.current.readyState === 4;
  }, [isActive, stream]);

  const startCamera = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Requesting camera access...');

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facingMode,
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsActive(true);
      }

      console.log('Camera started successfully');
      return true;

    } catch (error) {
      console.error('Error accessing camera:', error);

      // Try with less restrictive constraints
      try {
        const fallbackConstraints = {
          video: true,
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          setIsActive(true);
        }

        console.log('Camera started with fallback constraints');
        return true;

      } catch (fallbackError) {
        console.error('Fallback camera access failed:', fallbackError);
        return false;
      }
    }
  }, [facingMode]);

  const capturePhoto = useCallback((): string | null => {
    if (!isReady() || !videoRef.current || !canvasRef.current) {
      console.error('Camera is not ready');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return null;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Convert to base64 image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    console.log('Photo captured successfully');
    return imageData;
  }, [isReady]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setIsActive(false);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    console.log('Camera stopped');
  }, [stream]);

  const flipCamera = useCallback(async () => {
    try {
      console.log('Flipping camera...');

      // Stop current stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      // Toggle facing mode
      const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(newFacingMode);

      // Get new stream with flipped camera
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: newFacingMode,
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setStream(newStream);
      }

      console.log(`Camera flipped to: ${newFacingMode}`);

    } catch (error) {
      console.error('Error flipping camera:', error);
      throw error;
    }
  }, [stream, facingMode]);

  return {
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    isReady: isReady(),
    isActive,
    facingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    flipCamera,
  };
};
