
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

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
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="relative">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="w-full max-w-md mx-auto rounded-lg"
          />
          {onRemoveImage && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRemoveImage}
              className="absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
        isDragOver 
          ? 'border-blue-400 bg-blue-500/10' 
          : 'border-white/30 bg-white/5'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {isDragOver ? (
            <Upload className="w-12 h-12 text-blue-400 animate-pulse" />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <p className="text-white font-medium mb-2">Upload an Image</p>
        <p className="text-gray-400 text-sm mb-4">
          Drag and drop an image here, or click to select
        </p>
        <Button variant="outline" className="bg-white/10 text-white border-white/20">
          <Upload className="w-4 h-4 mr-2" />
          Choose Image
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
