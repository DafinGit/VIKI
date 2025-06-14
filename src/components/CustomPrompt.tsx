
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Zap, Terminal, Send } from 'lucide-react';

interface CustomPromptProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const CustomPrompt: React.FC<CustomPromptProps> = ({ 
  prompt, 
  setPrompt, 
  onAnalyze, 
  isLoading 
}) => {
  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
            CUSTOM ANALYSIS INTERFACE
          </h3>
        </div>

        <div>
          <label className="block text-cyan-300 font-mono font-semibold mb-3 text-sm uppercase tracking-wide">
            Neural Query Input Protocol
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter cognitive analysis parameters... (e.g., Execute mathematical formula recognition protocol, Initialize detailed scene composition analysis)"
              className="w-full h-32 px-4 py-3 bg-gradient-to-r from-gray-900/60 to-black/60 border border-cyan-500/40 rounded-lg text-cyan-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 resize-none font-mono text-sm leading-relaxed transition-all duration-300"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono">
              {prompt.length}/500
            </div>
          </div>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!prompt.trim() || isLoading}
          className={`w-full h-12 font-mono font-semibold text-base transition-all duration-300 ${
            isLoading 
              ? 'bg-gradient-to-r from-yellow-500/50 to-orange-500/50 text-yellow-100' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>PROCESSING NEURAL ANALYSIS...</span>
              <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <span>EXECUTE VISION ANALYSIS</span>
              <Send className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>
    </Card>
  );
};
