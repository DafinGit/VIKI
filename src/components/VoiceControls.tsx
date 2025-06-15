
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceControlsProps {
  isSpeaking: boolean;
  currentLanguage: string;
  onTestVoice: () => void;
  onStopSpeech: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isSpeaking,
  currentLanguage,
  onTestVoice,
  onStopSpeech
}) => {
  const getTestMessage = (languageCode: string) => {
    switch (languageCode) {
      case 'ro-RO':
        return "Salut! Sunt VIKI, sistemul neural care este acum online și pregătit pentru conversație în limba română. Vocea mea feminină este optimizată pentru o experiență naturală.";
      case 'en-GB':
        return "Hello! I'm VIKI, your neural system now online and ready for interaction in British English. My feminine voice is optimised for a natural experience.";
      default:
        return "Hello! I'm VIKI, your neural system now online and ready for interaction.";
    }
  };

  const handleTestVoice = () => {
    console.log('Testing voice for language:', currentLanguage);
    console.log('Test message:', getTestMessage(currentLanguage));
    onTestVoice();
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleTestVoice}
        disabled={isSpeaking}
        className="flex-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 font-mono"
      >
        <Volume2 className="w-4 h-4 mr-2" />
        TEST VOICE
      </Button>
      <Button
        onClick={onStopSpeech}
        disabled={!isSpeaking}
        className="bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30 font-mono"
      >
        <VolumeX className="w-4 h-4" />
      </Button>
    </div>
  );
};
