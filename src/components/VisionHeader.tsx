
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera, Cpu, Zap } from 'lucide-react';

interface VisionHeaderProps {
  selectedImage: string;
  imageFile: File | null;
}

export const VisionHeader: React.FC<VisionHeaderProps> = ({ selectedImage, imageFile }) => {
  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
              VISION ANALYSIS CORE
            </h2>
            <p className="text-cyan-300 text-sm font-mono">Neural Network Analysis Engine v2.1</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-mono">
            <Cpu className="w-4 h-4 mr-1" />
            AI ACTIVE
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono">
            <Zap className="w-4 h-4 mr-1" />
            ONLINE
          </Badge>
        </div>
      </div>
      
      <div className="border-l-4 border-cyan-400 pl-4 mb-4">
        <p className="text-gray-300 font-mono text-sm leading-relaxed">
          Advanced multimodal AI vision system with deep neural network analysis capabilities.
          <br />
          <span className="text-cyan-400">Initialize image upload protocol to begin cognitive processing.</span>
        </p>
      </div>

      {selectedImage && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center">
              <Camera className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="text-green-300 text-sm font-mono font-semibold">
                IMAGE LOADED: {imageFile?.name}
              </p>
              <p className="text-gray-400 text-xs font-mono">
                TYPE: {imageFile?.type} | SIZE: {Math.round((imageFile?.size || 0) / 1024)}KB | STATUS: READY FOR ANALYSIS
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
