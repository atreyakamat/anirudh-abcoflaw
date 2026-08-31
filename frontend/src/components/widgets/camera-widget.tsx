'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, ChevronDown, FlipHorizontal, Maximize2, Minimize2, Video, X } from 'lucide-react';

export function CameraWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop active camera stream tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Fetch available camera devices
  const getCameraDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err: any) {
      console.warn('Unable to enumerate camera devices:', err);
    }
  }, [selectedDeviceId]);

  // Start video stream with selected device
  const startStream = useCallback(async (deviceId?: string) => {
    stopStream();
    setError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 } } : { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
      
      // Update device list once permission is granted (to get device labels)
      await getCameraDevices();
    } catch (err: any) {
      console.error('Camera access error:', err);
      setError(err.name === 'NotAllowedError' ? 'Camera permission denied.' : 'Unable to access selected camera.');
      setIsStreaming(false);
    }
  }, [stopStream, getCameraDevices]);

  // Handle camera toggling
  const toggleCamera = () => {
    if (!isOpen) {
      setIsOpen(true);
      startStream(selectedDeviceId);
    } else {
      if (isStreaming) {
        stopStream();
      } else {
        startStream(selectedDeviceId);
      }
    }
  };

  // Close floating window and stop stream
  const closeWindow = () => {
    stopStream();
    setIsOpen(false);
  };

  // Handle device change
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    if (isStreaming) {
      startStream(deviceId);
    }
  };

  // Trigger Picture-in-Picture mode
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return (
    <div className="relative">
      {/* Topbar Toggle Button */}
      <button
        onClick={toggleCamera}
        className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 relative ${
          isOpen || isStreaming
            ? 'bg-primary/10 text-primary border border-primary/30'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
        title="Toggle Camera Widget"
        aria-label="Camera Widget"
      >
        <Video className="w-5 h-5" />
        {isStreaming && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Floating Attached Camera Window */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 z-50 bg-card border rounded-xl shadow-2xl transition-all overflow-hidden ${
            isMinimized ? 'w-72' : 'w-80 sm:w-96'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-muted/60 border-b">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs font-semibold text-foreground">Camera Preview</span>
            </div>

            <div className="flex items-center gap-1">
              {isStreaming && (
                <>
                  <button
                    onClick={() => setIsMirrored(!isMirrored)}
                    className={`p-1 rounded hover:bg-accent text-xs transition-colors ${isMirrored ? 'text-primary' : 'text-muted-foreground'}`}
                    title="Mirror View"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={togglePiP}
                    className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground text-xs transition-colors"
                    title="Picture-in-Picture"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground text-xs transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={closeWindow}
                className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                title="Close Camera"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Video Preview Body */}
          {!isMinimized && (
            <div className="p-3 space-y-3">
              <div className="relative aspect-video w-full bg-black/90 rounded-lg overflow-hidden flex items-center justify-center border border-border/50 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isMirrored ? '-scale-x-100' : 'scale-x-100'
                  } ${!isStreaming ? 'hidden' : ''}`}
                />

                {!isStreaming && !error && (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground text-xs p-4 text-center">
                    <CameraOff className="w-8 h-8 text-muted-foreground/50" />
                    <span>Camera is turned off</span>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center gap-2 text-destructive text-xs p-4 text-center bg-destructive/10">
                    <CameraOff className="w-8 h-8" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Camera Device Selector & Stream Controls */}
              <div className="space-y-2">
                {devices.length > 1 && (
                  <div className="relative">
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">Select Camera</label>
                    <div className="relative">
                      <select
                        value={selectedDeviceId}
                        onChange={(e) => handleDeviceChange(e.target.value)}
                        className="w-full text-xs bg-background border rounded-lg pl-2.5 pr-8 py-1.5 text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary truncate"
                      >
                        {devices.map((device, index) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${index + 1}`}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Turn On / Turn Off Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={isStreaming ? stopStream : () => startStream(selectedDeviceId)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                      isStreaming
                        ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isStreaming ? (
                      <>
                        <CameraOff className="w-3.5 h-3.5" />
                        Turn Off Camera
                      </>
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5" />
                        Turn On Camera
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
