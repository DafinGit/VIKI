
import { useState, useEffect, useRef } from 'react';

export interface SpeechConfig {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [config, setConfig] = useState<SpeechConfig>({
    language: 'ro-RO',
    rate: 0.8,
    pitch: 1.0,
    volume: 0.9
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang}) - Local: ${v.localService}`));
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const findBestVoice = (targetLanguage: string) => {
    if (voices.length === 0) {
      console.log('No voices available yet');
      return null;
    }

    // Extract language code (e.g., 'en' from 'en-US')
    const langCode = targetLanguage.split('-')[0];
    
    console.log(`Finding best voice for language: ${targetLanguage} (${langCode})`);
    
    // Priority 1: Exact language match (e.g., 'en-US' matches 'en-US')
    let selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase() === targetLanguage.toLowerCase()
    );
    
    if (selectedVoice) {
      console.log(`Found exact match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 2: Same language code with different region (e.g., 'en-GB' for 'en-US')
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase() + '-')
    );
    
    if (selectedVoice) {
      console.log(`Found language code match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 3: Language code without region (e.g., 'en' for 'en-US')
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase() === langCode.toLowerCase()
    );
    
    if (selectedVoice) {
      console.log(`Found base language match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 4: Partial match (starts with language code)
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    
    if (selectedVoice) {
      console.log(`Found partial match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Fallback: Use default voice
    console.log('No suitable voice found, using default');
    return voices[0] || null;
  };

  const speak = (text: string) => {
    if (!text.trim()) return;

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find the best voice for the selected language
    const selectedVoice = findBestVoice(config.language);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for language: ${config.language}`);
    } else {
      console.log(`No specific voice found for ${config.language}, using browser default`);
    }

    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    utterance.lang = config.language;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const pause = () => {
    speechSynthesis.pause();
  };

  const resume = () => {
    speechSynthesis.resume();
  };

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    voices,
    config,
    setConfig
  };
};
