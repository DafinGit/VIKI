
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Scan, Target } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  selectedImage?: string;
  onRemoveImage?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  selectedImage, 
  onRemoveImage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        onImageSelect(file, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  if (selectedImage) {
    return (
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-mono">
            IMAGE ACQUIRED - READY FOR ANALYSIS
          </h3>
        </div>
        
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
          <img 
            src={selectedImage} 
            alt="Neural Analysis Target" 
            className="relative w-full max-w-md mx-auto rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
          />
          {onRemoveImage && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm border border-red-400/50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-green-400 font-mono text-xs font-semibold">TARGET LOCKED</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
        isDragOver 
          ? 'border-cyan-400 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/20' 
          : 'border-cyan-500/40 bg-black/20 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            {isDragOver ? (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse">
                <Upload className="w-10 h-10 text-white" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center border border-cyan-500/30">
                <ImageIcon className="w-10 h-10 text-cyan-400" />
              </div>
            )}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
              <Scan className="w-3 h-3 text-black" />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono mb-2">
          INITIALIZE IMAGE CAPTURE PROTOCOL
        </h3>
        <p className="text-gray-400 text-sm font-mono mb-6 leading-relaxed">
          Drag and drop visual data here, or execute manual selection protocol
          <br />
          <span className="text-cyan-400">Supported formats: JPG, PNG, WEBP | Max size: 10MB</span>
        </p>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400 font-mono"
        >
          <Upload className="w-4 h-4 mr-2" />
          EXECUTE IMAGE UPLOAD
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </Card>
  );
};
