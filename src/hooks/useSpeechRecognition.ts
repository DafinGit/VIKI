
import { useState, useEffect, useRef } from 'react';

export interface RecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [config, setConfig] = useState<RecognitionConfig>({
    language: 'ro-RO',
    continuous: true,
    interimResults: true
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldBeListeningRef = useRef(false);
  const isManuallyStoppedRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = config.continuous;
      recognition.interimResults = config.interimResults;
      recognition.lang = config.language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // Only auto-restart if we should be listening and it wasn't manually stopped
        if (shouldBeListeningRef.current && !isManuallyStoppedRef.current && config.continuous) {
          console.log('Auto-restarting speech recognition');
          setTimeout(() => {
            if (shouldBeListeningRef.current && !isManuallyStoppedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Error restarting recognition:', error);
              }
            }
          }, 500);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          setTranscript(prev => prev + finalTranscript);
        }
        setInterimTranscript(interimTranscript);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          console.log('No speech detected, continuing...');
        } else if (event.error === 'audio-capture') {
          console.error('Audio capture error - check microphone permissions');
          shouldBeListeningRef.current = false;
          isManuallyStoppedRef.current = true;
          setIsListening(false);
        } else if (event.error === 'not-allowed') {
          console.error('Microphone access denied');
          shouldBeListeningRef.current = false;
          isManuallyStoppedRef.current = true;
          setIsListening(false);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [config]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      console.log('Starting speech recognition manually');
      setTranscript('');
      setInterimTranscript('');
      shouldBeListeningRef.current = true;
      isManuallyStoppedRef.current = false;
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    console.log('Stopping speech recognition manually');
    shouldBeListeningRef.current = false;
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const forceStop = () => {
    console.log('Force stopping speech recognition');
    shouldBeListeningRef.current = false;
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    config,
    setConfig,
    startListening,
    stopListening,
    forceStop,
    resetTranscript
  };
};
