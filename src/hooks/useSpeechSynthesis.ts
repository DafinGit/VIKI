
import { useState, useEffect, useRef } from 'react';
import { detectTextLanguage } from '@/utils/languageDetection';
import { findBestVoice, logVoiceAnalysis } from '@/utils/voiceSelection';
import { SpeechConfig } from '@/types/speechConfig';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [config, setConfig] = useState<SpeechConfig>({
    language: 'en-GB', // Changed default to British English
    rate: 0.8,
    pitch: 1.0,
    volume: 0.9
  });
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      logVoiceAnalysis(availableVoices);
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = (text: string) => {
    if (!text.trim()) return;

    console.log(`\n=== SPEAKING TEXT ===`);
    console.log(`Text: "${text}"`);
    console.log(`Current config language: ${config.language}`);

    // CRITICAL FIX: Detect the actual language of the text
    const detectedLanguage = detectTextLanguage(text);
    console.log(`Detected text language: ${detectedLanguage}`);

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Use detected language instead of config language for voice selection
    const selectedVoice = findBestVoice(voices, detectedLanguage);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎵 Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      console.log(`Voice details: Local=${selectedVoice.localService}, Default=${selectedVoice.default}`);
    } else {
      console.log(`⚠️ No specific voice found for ${detectedLanguage}, using browser default`);
    }

    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    // Use detected language for speech synthesis
    utterance.lang = detectedLanguage;

    console.log(`Speech settings: Rate=${config.rate}, Pitch=${config.pitch}, Volume=${config.volume}, Lang=${detectedLanguage}`);

    utterance.onstart = () => {
      console.log('🔊 Speech started');
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('🔇 Speech ended');
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Speech synthesis error:', event);
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
