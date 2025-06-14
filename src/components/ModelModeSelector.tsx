
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Eye, Cpu, Activity } from 'lucide-react';

interface ModelModeSelectorProps {
  modelMode: 'normal' | 'medical';
  onModeChange: (mode: 'normal' | 'medical') => void;
}

export const ModelModeSelector: React.FC<ModelModeSelectorProps> = ({ 
  modelMode, 
  onModeChange 
}) => {
  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
      <div className="flex items-center gap-3 mb-4">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
          NEURAL PROCESSING MODE
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant={modelMode === 'normal' ? 'default' : 'outline'}
          onClick={() => onModeChange('normal')}
          className={`h-auto p-4 ${modelMode === 'normal' 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/25' 
            : 'bg-black/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Eye className="w-6 h-6" />
            <span className="font-mono font-semibold">STANDARD VISION</span>
            <span className="text-xs opacity-80">General Analysis Protocol</span>
          </div>
        </Button>

        <Button
          variant={modelMode === 'medical' ? 'default' : 'outline'}
          onClick={() => onModeChange('medical')}
          className={`h-auto p-4 ${modelMode === 'medical' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 shadow-lg shadow-green-500/25' 
            : 'bg-black/20 text-green-300 border-green-500/40 hover:bg-green-500/10 hover:border-green-400'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Stethoscope className="w-6 h-6" />
            <span className="font-mono font-semibold">MEDICAL SCANNER</span>
            <span className="text-xs opacity-80">Diagnostic Analysis Protocol</span>
          </div>
        </Button>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-600/30">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-mono text-sm font-semibold">ACTIVE CONFIGURATION:</span>
        </div>
        <p className="text-gray-300 text-sm font-mono">
          {modelMode === 'medical' 
            ? 'MEDICAL MODE: Specialized neural networks optimized for diagnostic imaging analysis and pathological detection protocols.'
            : 'STANDARD MODE: General-purpose vision processing with multi-modal cognitive analysis capabilities.'
          }
        </p>
      </div>
    </Card>
  );
};
