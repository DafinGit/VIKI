
import React from 'react';
import { Card } from '@/components/ui/card';
import { Zap, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';

interface AnalysisResultProps {
  analysis: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  if (!analysis) return null;

  const isError = analysis.includes('❌') || analysis.includes('Error') || analysis.includes('Failed');
  const isSuccess = analysis.includes('✅') || analysis.includes('Analysis:');

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Cpu className="w-6 h-6 text-cyan-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
          NEURAL ANALYSIS OUTPUT
        </h3>
        {isSuccess && (
          <CheckCircle className="w-5 h-5 text-green-400" />
        )}
        {isError && (
          <AlertTriangle className="w-5 h-5 text-red-400" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-mono font-semibold">PROCESSING COMPLETE</span>
          <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
        </div>

        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 p-5 rounded-lg border border-gray-700/50 shadow-inner">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-mono text-sm font-semibold uppercase tracking-wide">
              Analysis Data Stream
            </span>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-cyan-100 text-sm leading-relaxed font-mono bg-transparent p-0 m-0 border-none">
              {analysis}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 font-mono pt-2 border-t border-gray-700/30">
          <span>VIKI NEURAL PROCESSING SYSTEM</span>
          <span>{new Date().toLocaleTimeString()} GMT</span>
        </div>
      </div>
    </Card>
  );
};
