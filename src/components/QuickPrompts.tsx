
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Stethoscope, Zap, Brain } from 'lucide-react';

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
    "Execute comprehensive visual analysis protocol",
    "Identify and catalog all detected objects",
    "Analyze compositional structure and visual elements",
    "Assess atmospheric and contextual parameters",
    "Extract and decode textual information",
    "Process mathematical concepts and formulations",
    "Analyze procedural sequences and workflows"
  ];

  const medicalPrompts = [
    "Initiate diagnostic anomaly detection scan",
    "Map anatomical structures and tissue identification",
    "Evaluate pathological indicators and conditions",
    "Perform radiological findings assessment",
    "Analyze image quality and technical parameters",
    "Execute comparative normal vs abnormal analysis",
    "Generate diagnostic consideration matrix"
  ];

  const quickPrompts = modelMode === 'medical' ? medicalPrompts : normalPrompts;
  const icon = modelMode === 'medical' ? Stethoscope : Brain;
  const IconComponent = icon;

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
      <div className="flex items-center gap-3 mb-4">
        <IconComponent className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
          {modelMode === 'medical' ? 'MEDICAL ANALYSIS PROTOCOLS' : 'COGNITIVE ANALYSIS PROTOCOLS'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickPrompts.map((quickPrompt, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => onPromptSelect(quickPrompt)}
            className="text-left h-auto p-4 bg-gradient-to-r from-gray-900/40 to-gray-800/40 text-cyan-300 border-cyan-500/30 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:border-cyan-400 justify-start group transition-all duration-300"
            disabled={isLoading}
          >
            <div className="flex items-start gap-3 w-full">
              <Zap className="w-4 h-4 text-yellow-400 mt-0.5 group-hover:animate-pulse" />
              <div className="text-sm font-mono leading-relaxed">{quickPrompt}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
