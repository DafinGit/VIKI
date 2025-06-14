
import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface AnalysisResultProps {
  analysis: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Vision Analysis Result
      </h3>
      <div className="prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-gray-200 text-sm bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
          {analysis}
        </div>
      </div>
    </Card>
  );
};
