
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Camera } from 'lucide-react';

interface VisionHeaderProps {
  selectedImage: string;
  imageFile: File | null;
}

export const VisionHeader: React.FC<VisionHeaderProps> = ({ selectedImage, imageFile }) => {
  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Vision Analysis</h2>
        </div>
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
          <Camera className="w-4 h-4 mr-1" />
          Multimodal AI
        </Badge>
      </div>
      <p className="text-gray-300">
        Upload images and let DeepSeek-R1 analyze them with advanced computer vision capabilities.
      </p>
      {selectedImage && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            ✓ Image loaded: {imageFile?.name} ({imageFile?.type}, {Math.round((imageFile?.size || 0) / 1024)}KB)
          </p>
        </div>
      )}
    </Card>
  );
};
