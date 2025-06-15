
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  interimTranscript: string;
  onToggleMic: () => void;
}

export const MicrophoneControls: React.FC<MicrophoneControlsProps> = ({
  isListening,
  isSpeaking,
  isSupported,
  interimTranscript,
  onToggleMic
}) => {
  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={onToggleMic}
          disabled={isSpeaking}
          className={`flex-1 font-mono ${
            isListening 
              ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' 
              : isSpeaking
              ? 'bg-gray-500/20 text-gray-400 border-gray-500/40'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
          {isSpeaking ? 'AI SPEAKING...' : isListening ? 'STOP LISTENING' : 'START LISTENING'}
        </Button>
      </div>

      {interimTranscript && (
        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded text-blue-300 text-xs font-mono">
          Listening: {interimTranscript}
        </div>
      )}

      <div className="flex items-center gap-2 justify-end">
        {isListening && (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse">
            LISTENING
          </Badge>
        )}
      </div>
    </div>
  );
};
