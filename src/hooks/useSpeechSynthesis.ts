import { useState, useEffect, useRef } from 'react';
import { detectTextLanguage } from '@/utils/languageDetection';
import { findBestVoice, logVoiceAnalysis } from '@/utils/voiceSelection';
import { SpeechConfig } from '@/types/speechConfig';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [config, setConfig] = useState<SpeechConfig>({
    language: 'en-GB',
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
    console.log(`Text length: ${text.length} characters`);
    console.log(`Current config language: ${config.language}`);

    // Detect the actual language of the text
    const detectedLanguage = detectTextLanguage(text);
    console.log(`Detected text language: ${detectedLanguage}`);

    // Stop any current speech
    speechSynthesis.cancel();
    
    // Wait a moment before starting new speech to ensure cleanup
    setTimeout(() => {
      // Simple approach: if text is too long, split by sentences, otherwise speak as is
      let textToSpeak = text;
      
      // For very long texts (over 300 characters), split into sentences
      if (text.length > 300) {
        const sentences = text.match(/[^\.!?]+[\.!?]+/g);
        if (sentences && sentences.length > 1) {
          // Take first few sentences to keep it manageable
          textToSpeak = sentences.slice(0, 3).join(' ').trim();
          console.log(`Long text detected, using first part: "${textToSpeak.substring(0, 100)}..."`);
        }
      }

      console.log(`Speaking text: "${textToSpeak.substring(0, 100)}..."`);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      // Use detected language for voice selection
      const selectedVoice = findBestVoice(voices, detectedLanguage);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`🎵 Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.log(`⚠️ No specific voice found for ${detectedLanguage}, using browser default`);
      }

      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;
      utterance.lang = detectedLanguage;

      utterance.onstart = () => {
        console.log('🔊 Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('✅ Speech completed successfully');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Speech synthesis error:', event);
        setIsSpeaking(false);
      };

      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Error starting speech synthesis:', error);
        setIsSpeaking(false);
      }
    }, 100); // Reduced delay
  };

  const stop = () => {
    console.log('🛑 Stopping speech synthesis');
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
