
import React from 'react';
import { VisionHeader } from './VisionHeader';
import { QuickPrompts } from './QuickPrompts';
import { CustomPrompt } from './CustomPrompt';
import { AnalysisResult } from './AnalysisResult';
import { ImageUpload } from './ImageUpload';
import { ModelModeSelector } from './ModelModeSelector';
import { useVisionAnalysis } from '@/hooks/useVisionAnalysis';

interface VisionAnalysisProps {
  apiKey: string;
}

export const VisionAnalysis: React.FC<VisionAnalysisProps> = ({ apiKey }) => {
  const {
    selectedImage,
    imageFile,
    prompt,
    analysis,
    isLoading,
    modelMode,
    setPrompt,
    setModelMode,
    handleImageSelect,
    handleRemoveImage,
    analyzeImage
  } = useVisionAnalysis(apiKey);

  const handleQuickPromptSelect = (promptText: string) => {
    setPrompt(promptText);
    analyzeImage(promptText);
  };

  const handleCustomAnalyze = () => {
    analyzeImage(prompt);
  };

  return (
    <div className="space-y-6">
      <VisionHeader selectedImage={selectedImage} imageFile={imageFile} />
      
      <ImageUpload
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage}
        onRemoveImage={handleRemoveImage}
      />

      {selectedImage && (
        <>
          <ModelModeSelector 
            modelMode={modelMode}
            onModeChange={setModelMode}
          />

          <QuickPrompts 
            onPromptSelect={handleQuickPromptSelect}
            isLoading={isLoading}
          />
          
          <CustomPrompt
            prompt={prompt}
            setPrompt={setPrompt}
            onAnalyze={handleCustomAnalyze}
            isLoading={isLoading}
          />
        </>
      )}

      <AnalysisResult analysis={analysis} />
    </div>
  );
};
