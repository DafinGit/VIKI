
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Zap } from 'lucide-react';

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
    <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
      <div className="space-y-4">
        <div>
          <label className="block text-white font-medium mb-2">Custom Analysis Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about the image... (e.g., What mathematical formula is shown? Describe the scene in detail)"
            className="w-full h-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          />
        </div>
        <Button
          onClick={onAnalyze}
          disabled={!prompt.trim() || isLoading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        >
          {isLoading ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Analyze Image
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
