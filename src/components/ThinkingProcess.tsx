
import React from 'react';
import { Card } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface ThinkingProcessProps {
  thinking: string;
}

export const ThinkingProcess: React.FC<ThinkingProcessProps> = ({ thinking }) => {
  return (
    <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-300 text-sm font-medium">Thinking Process</span>
      </div>
      <pre className="text-xs text-yellow-200 whitespace-pre-wrap font-mono">
        {thinking}
      </pre>
    </Card>
  );
};
