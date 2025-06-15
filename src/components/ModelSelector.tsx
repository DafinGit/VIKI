
import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Cpu, Zap, Brain, Sparkles } from 'lucide-react';

interface ModelSelectorProps {
  modelProvider: 'deepseek' | 'gemini';
  onProviderChange: (provider: 'deepseek' | 'gemini') => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  modelProvider,
  onProviderChange
}) => {
  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
      <div className="flex items-center gap-3 mb-4">
        <Cpu className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
          MODEL PROVIDER SELECTION
        </h3>
      </div>

      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900/60 to-black/60 border border-gray-700/50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-orange-400" />
            <span className="font-mono font-semibold text-orange-300">DEEPSEEK-R1</span>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/40 font-mono text-xs">
              <Zap className="w-3 h-3 mr-1" />
              OpenRouter
            </Badge>
          </div>
          
          <Switch
            checked={modelProvider === 'gemini'}
            onCheckedChange={(checked) => onProviderChange(checked ? 'gemini' : 'deepseek')}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
          />
          
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span className="font-mono font-semibold text-green-300">GEMINI-FLASH</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono text-xs">
              <Brain className="w-3 h-3 mr-1" />
              Direct API
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-600/30">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            modelProvider === 'deepseek' ? 'bg-orange-400' : 'bg-green-400'
          }`}></div>
          <span className={`font-mono text-sm font-semibold ${
            modelProvider === 'deepseek' ? 'text-orange-400' : 'text-green-400'
          }`}>
            ACTIVE: {modelProvider === 'deepseek' ? 'DEEPSEEK-R1' : 'GEMINI-FLASH-1.5'}
          </span>
        </div>
        <p className="text-gray-300 text-sm font-mono">
          {modelProvider === 'deepseek' 
            ? 'Advanced reasoning model with enhanced chain-of-thought capabilities. Requires OpenRouter credits.'
            : 'Fast and efficient Google Gemini model with direct API access. Use when OpenRouter credits are low.'
          }
        </p>
      </div>
    </Card>
  );
};
