
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Stethoscope } from 'lucide-react';

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
  isLoading: boolean;
  modelMode: 'normal' | 'medical';
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ 
  onPromptSelect, 
  isLoading, 
  modelMode 
}) => {
  const normalPrompts = [
    "Describe what you see in this image in detail",
    "What objects can you identify in this image?",
    "Analyze the composition and visual elements",
    "What's the mood or atmosphere of this image?",
    "Extract any text you can see in this image",
    "What mathematical concepts are shown here?",
    "Explain the process or steps shown in this diagram"
  ];

  const medicalPrompts = [
    "Analyze this medical image for any visible abnormalities",
    "Describe the anatomical structures visible in this image",
    "What medical conditions might be indicated by this image?",
    "Identify any radiological findings or pathological changes",
    "Assess the image quality and technical parameters",
    "Compare normal vs abnormal findings in this medical scan",
    "What diagnostic considerations should be evaluated?"
  ];

  const quickPrompts = modelMode === 'medical' ? medicalPrompts : normalPrompts;
  const icon = modelMode === 'medical' ? Stethoscope : Lightbulb;
  const IconComponent = icon;

  return (
    <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <IconComponent className="w-5 h-5 text-yellow-400" />
        {modelMode === 'medical' ? 'Medical Analysis Prompts' : 'Quick Analysis Prompts'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {quickPrompts.map((quickPrompt, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onPromptSelect(quickPrompt)}
            className="text-left h-auto p-3 bg-white/5 text-white border-white/20 hover:bg-white/10 justify-start"
            disabled={isLoading}
          >
            <div className="text-sm">{quickPrompt}</div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
