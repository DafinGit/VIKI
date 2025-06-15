
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Cpu, Activity, Zap } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

export const NeuralInterfaceHeader: React.FC = () => {
  const speech = useSpeechSynthesis();

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
              NEURAL INTERFACE SYSTEM
            </h2>
            <p className="text-cyan-300 text-sm font-mono">Advanced Reasoning Engine v2.1 • I, Robot Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-mono">
            <Cpu className="w-4 h-4 mr-1" />
            AI ACTIVE
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono">
            <Zap className="w-4 h-4 mr-1" />
            ONLINE
          </Badge>
          {speech.isSpeaking && (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/40 font-mono animate-pulse">
              <Activity className="w-4 h-4 mr-1" />
              SPEAKING
            </Badge>
          )}
        </div>
      </div>
      
      <div className="border-l-4 border-cyan-400 pl-4">
        <p className="text-gray-300 font-mono text-sm leading-relaxed">
          Advanced conversational AI with deep reasoning capabilities, multimodal interaction, and I, Robot-style voice synthesis.
          <br />
          <span className="text-cyan-400">Neural conversation protocol initialized. Voice interface and visual sensors available.</span>
        </p>
      </div>
    </Card>
  );
};
