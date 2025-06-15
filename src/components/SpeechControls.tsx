
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { LanguageSelector } from './LanguageSelector';
import { VoiceSettings } from './VoiceSettings';
import { VoiceControls } from './VoiceControls';
import { MicrophoneControls } from './MicrophoneControls';

interface SpeechControlsProps {
  onVoiceInput: (text: string) => void;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  onVoiceInput
}) => {
  const speech = useSpeechSynthesis();
  const recognition = useSpeechRecognition();
  const lastProcessedTranscriptRef = React.useRef<string>('');
  const speechEndTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Only process new transcripts to prevent duplicates
    if (recognition.transcript && 
        recognition.transcript !== lastProcessedTranscriptRef.current &&
        recognition.transcript.trim().length > 0 &&
        !speech.isSpeaking) { // Don't process if AI is currently speaking
      
      console.log('Processing new transcript:', recognition.transcript);
      lastProcessedTranscriptRef.current = recognition.transcript;
      onVoiceInput(recognition.transcript.trim());
      recognition.resetTranscript();
    }
  }, [recognition.transcript, onVoiceInput, recognition, speech.isSpeaking]);

  // Stop listening when AI starts speaking, restart when it stops
  React.useEffect(() => {
    if (speech.isSpeaking && recognition.isListening) {
      console.log('AI is speaking, temporarily stopping voice recognition');
      recognition.stopListening();
    } else if (!speech.isSpeaking && !recognition.isListening) {
      // Clear any existing timeout
      if (speechEndTimeoutRef.current) {
        clearTimeout(speechEndTimeoutRef.current);
      }
      
      // Restart listening after a short delay when AI stops speaking
      speechEndTimeoutRef.current = setTimeout(() => {
        console.log('AI finished speaking, restarting voice recognition');
        recognition.startListening();
      }, 1500); // Wait 1.5 seconds after AI stops speaking
    }
  }, [speech.isSpeaking, recognition]);

  const handleLanguageChange = (languageCode: string) => {
    speech.setConfig(prev => ({ ...prev, language: languageCode }));
    recognition.setConfig(prev => ({ ...prev, language: languageCode }));
  };

  const handleVoiceConfigChange = (configUpdate: Partial<typeof speech.config>) => {
    speech.setConfig(prev => ({ ...prev, ...configUpdate }));
  };

  const handleMicToggle = () => {
    if (recognition.isListening) {
      recognition.stopListening();
      lastProcessedTranscriptRef.current = '';
      if (speechEndTimeoutRef.current) {
        clearTimeout(speechEndTimeoutRef.current);
      }
    } else {
      // Don't start listening if AI is currently speaking
      if (!speech.isSpeaking) {
        recognition.startListening();
      }
    }
  };

  const handleTestVoice = () => {
    const language = speech.config.language;
    const testMessage = language === 'ro-RO' 
      ? "Salut! Sistemul neural VIKI este acum online și pregătit pentru conversație în limba română."
      : "Hello! VIKI Neural System is now online and ready for interaction.";
    
    speech.speak(testMessage);
  };

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border border-cyan-500/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium font-mono">NEURAL VOICE INTERFACE</span>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              ROMANIAN MODE
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {speech.isSpeaking && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
                SPEAKING
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <LanguageSelector
              selectedLanguage={speech.config.language}
              onLanguageChange={handleLanguageChange}
            />

            <VoiceSettings
              config={speech.config}
              onConfigChange={handleVoiceConfigChange}
            />
          </div>

          <div className="space-y-3">
            <VoiceControls
              isSpeaking={speech.isSpeaking}
              currentLanguage={speech.config.language}
              onTestVoice={handleTestVoice}
              onStopSpeech={speech.stop}
            />

            <MicrophoneControls
              isListening={recognition.isListening}
              isSpeaking={speech.isSpeaking}
              isSupported={recognition.isSupported}
              interimTranscript={recognition.interimTranscript}
              onToggleMic={handleMicToggle}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
