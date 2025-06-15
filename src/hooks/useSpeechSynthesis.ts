
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
      console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang}) - Local: ${v.localService}, Default: ${v.default}`));
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
    console.log('Available voices for analysis:', voices.map(v => `${v.name} (${v.lang}) - Local: ${v.localService}`));
    
    // Priority 1: Exact language match with local/native voice
    let selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase() === targetLanguage.toLowerCase() && voice.localService
    );
    
    if (selectedVoice) {
      console.log(`Found exact local match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 2: Exact language match (any voice)
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase() === targetLanguage.toLowerCase()
    );
    
    if (selectedVoice) {
      console.log(`Found exact match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 3: Same language code with local voice
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase() + '-') && voice.localService
    );
    
    if (selectedVoice) {
      console.log(`Found local language code match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 4: Same language code (any voice) - but avoid voices that might have wrong accents
    const languageMatches = voices.filter(voice => 
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase() + '-')
    );
    
    // For English, prefer voices that don't have "Romania" or similar in the name
    if (langCode.toLowerCase() === 'en' && languageMatches.length > 0) {
      const nativeEnglishVoice = languageMatches.find(voice => 
        !voice.name.toLowerCase().includes('romania') && 
        !voice.name.toLowerCase().includes('romanian')
      );
      
      if (nativeEnglishVoice) {
        console.log(`Found native English voice: ${nativeEnglishVoice.name} (${nativeEnglishVoice.lang})`);
        return nativeEnglishVoice;
      }
    }
    
    selectedVoice = languageMatches[0];
    if (selectedVoice) {
      console.log(`Found language code match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 5: Base language code (without region)
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase() === langCode.toLowerCase()
    );
    
    if (selectedVoice) {
      console.log(`Found base language match: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Priority 6: Default voice for the target language
    selectedVoice = voices.find(voice => 
      voice.lang.toLowerCase().startsWith(langCode.toLowerCase()) && voice.default
    );
    
    if (selectedVoice) {
      console.log(`Found default voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // Fallback: Use system default voice
    console.log('No suitable voice found, using system default');
    return voices.find(voice => voice.default) || voices[0] || null;
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
      console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) - Local: ${selectedVoice.localService} for language: ${config.language}`);
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
