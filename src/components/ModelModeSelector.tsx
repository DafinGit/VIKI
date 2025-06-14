
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Eye } from 'lucide-react';

interface ModelModeSelectorProps {
  modelMode: 'normal' | 'medical';
  onModeChange: (mode: 'normal' | 'medical') => void;
}

export const ModelModeSelector: React.FC<ModelModeSelectorProps> = ({ 
  modelMode, 
  onModeChange 
}) => {
  return (
    <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
      <h3 className="text-lg font-semibold text-white mb-3">Analysis Mode</h3>
      <div className="flex gap-3">
        <Button
          variant={modelMode === 'normal' ? 'default' : 'outline'}
          onClick={() => onModeChange('normal')}
          className={modelMode === 'normal' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }
        >
          <Eye className="w-4 h-4 mr-2" />
          Normal Vision
        </Button>
        <Button
          variant={modelMode === 'medical' ? 'default' : 'outline'}
          onClick={() => onModeChange('medical')}
          className={modelMode === 'medical' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
          }
        >
          <Stethoscope className="w-4 h-4 mr-2" />
          Medical Analysis
        </Button>
      </div>
      <p className="text-sm text-gray-300 mt-2">
        {modelMode === 'medical' 
          ? 'Uses Gemma 3 4B and Gemini 2.0 Flash for medical image analysis'
          : 'Uses Gemini 2.0 Flash and other vision models for general analysis'
        }
      </p>
    </Card>
  );
};
