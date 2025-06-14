
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';

interface ChatControlsProps {
  showThinking: boolean;
  onToggleThinking: () => void;
}

export const ChatControls: React.FC<ChatControlsProps> = ({ 
  showThinking, 
  onToggleThinking 
}) => {
  return (
    <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">DeepSeek-R1 Chat</span>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            Free Tier
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            Multimodal
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleThinking}
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          {showThinking ? 'Hide' : 'Show'} Thinking Process
        </Button>
      </div>
    </Card>
  );
};
