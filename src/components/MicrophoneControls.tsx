
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, VolumeX } from 'lucide-react';

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
    return (
      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm font-mono">
        Speech recognition not supported in this browser
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={onToggleMic}
          disabled={isSpeaking}
          className={`flex-1 font-mono ${
            isSpeaking
              ? 'bg-gray-500/20 text-gray-400 border-gray-500/40 cursor-not-allowed'
              : isListening 
              ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' 
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              MIC DISABLED (AI SPEAKING)
            </>
          ) : isListening ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              STOP LISTENING
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              START LISTENING
            </>
          )}
        </Button>
      </div>

      {interimTranscript && !isSpeaking && (
        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded text-blue-300 text-xs font-mono">
          Listening: {interimTranscript}
        </div>
      )}

      <div className="flex items-center gap-2 justify-end">
        {isListening && !isSpeaking && (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse">
            LISTENING
          </Badge>
        )}
        {isSpeaking && (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
            MIC DISABLED
          </Badge>
        )}
      </div>
    </div>
  );
};
