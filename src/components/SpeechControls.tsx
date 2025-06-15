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

const getTestMessage = (languageCode: string) => {
  switch (languageCode) {
    case 'ro-RO':
      return "Salut! Sistemul neural VIKI este acum online și pregătit pentru conversație în limba română.";
    case 'en-GB':
      return "Hello! VIKI Neural System is now online and ready for interaction in British English.";
    default:
      return "Hello! VIKI Neural System is now online and ready for interaction.";
  }
};

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  onVoiceInput
}) => {
  const speech = useSpeechSynthesis();
  const recognition = useSpeechRecognition();
  const lastProcessedTranscriptRef = React.useRef<string>('');
  const wasListeningBeforeSpeechRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    // Only process new transcripts to prevent duplicates
    if (recognition.transcript && 
        recognition.transcript !== lastProcessedTranscriptRef.current &&
        recognition.transcript.trim().length > 0 &&
        !speech.isSpeaking) {
      
      console.log('Processing new transcript:', recognition.transcript);
      lastProcessedTranscriptRef.current = recognition.transcript;
      onVoiceInput(recognition.transcript.trim());
      recognition.resetTranscript();
    }
  }, [recognition.transcript, onVoiceInput, recognition, speech.isSpeaking]);

  // CRITICAL: Stop listening immediately when AI starts speaking
  React.useEffect(() => {
    if (speech.isSpeaking) {
      if (recognition.isListening) {
        console.log('AI is speaking - FORCE STOPPING voice recognition');
        wasListeningBeforeSpeechRef.current = true;
        recognition.forceStop();
      }
    } else if (!speech.isSpeaking && wasListeningBeforeSpeechRef.current) {
      // Wait longer before restarting to ensure AI has completely finished
      console.log('AI finished speaking, waiting before restart...');
      const timeout = setTimeout(() => {
        if (!speech.isSpeaking && wasListeningBeforeSpeechRef.current) {
          console.log('Restarting voice recognition after AI speech');
          wasListeningBeforeSpeechRef.current = false;
          recognition.startListening();
        }
      }, 2000); // Increased delay to 2 seconds

      return () => clearTimeout(timeout);
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
      wasListeningBeforeSpeechRef.current = false;
    } else {
      if (!speech.isSpeaking) {
        recognition.startListening();
      } else {
        console.log('Cannot start listening - AI is currently speaking');
      }
    }
  };

  const handleTestVoice = () => {
    if (recognition.isListening) {
      recognition.forceStop();
      wasListeningBeforeSpeechRef.current = true;
    }

    const testMessage = getTestMessage(speech.config.language);
    console.log(`Testing voice in ${speech.config.language}: ${testMessage}`);
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
              {speech.config.language === 'ro-RO' ? 'ROMANIAN MODE' : 'BRITISH ENGLISH MODE'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {speech.isSpeaking && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">
                AI SPEAKING - MIC DISABLED
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
