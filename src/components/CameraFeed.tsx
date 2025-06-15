
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Eye } from 'lucide-react';

interface CameraFeedProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ isEnabled, onToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (isEnabled && !stream) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            },
            audio: false 
          });
          
          setStream(mediaStream);
          setHasPermission(true);
          
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasPermission(false);
        }
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };

    if (isEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isEnabled, stream]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isEnabled) {
    return (
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-500/20 flex items-center justify-center">
            <CameraOff className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-400 font-mono">VISUAL SENSORS OFFLINE</h3>
            <p className="text-gray-400 text-sm font-mono">Camera access disabled</p>
          </div>
          <Button
            onClick={onToggle}
            className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 font-mono"
          >
            <Camera className="w-4 h-4 mr-2" />
            ACTIVATE VISUAL SENSORS
          </Button>
        </div>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-red-500/30 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
            <CameraOff className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400 font-mono">CAMERA ACCESS DENIED</h3>
            <p className="text-gray-400 text-sm font-mono">Please allow camera permissions to enable visual sensors</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border border-cyan-500/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium font-mono">VISUAL SENSORS</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
              ACTIVE
            </Badge>
            <Button
              onClick={onToggle}
              size="sm"
              className="bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30 font-mono"
            >
              <CameraOff className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 bg-black rounded-lg object-cover border border-cyan-500/30"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-red-500/80 text-white font-mono text-xs">
              ● LIVE
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-cyan-500/80 text-white font-mono text-xs">
              640x480
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="text-center p-2 bg-green-500/10 border border-green-500/30 rounded">
            <div className="text-green-400">STATUS</div>
            <div className="text-green-300">ONLINE</div>
          </div>
          <div className="text-center p-2 bg-blue-500/10 border border-blue-500/30 rounded">
            <div className="text-blue-400">MODE</div>
            <div className="text-blue-300">USER</div>
          </div>
          <div className="text-center p-2 bg-purple-500/10 border border-purple-500/30 rounded">
            <div className="text-purple-400">FEED</div>
            <div className="text-purple-300">REAL-TIME</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
