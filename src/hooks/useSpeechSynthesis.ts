
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
  const currentTextId = useRef<string>('');

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

    // Generate unique ID for this speech request
    const textId = Date.now().toString();
    currentTextId.current = textId;

    console.log(`\n=== SPEAKING TEXT ===`);
    console.log(`Text ID: ${textId}`);
    console.log(`Text length: ${text.length} characters`);
    console.log(`Current config language: ${config.language}`);

    // Detect the actual language of the text
    const detectedLanguage = detectTextLanguage(text);
    console.log(`Detected text language: ${detectedLanguage}`);

    // Stop any current speech completely
    speechSynthesis.cancel();
    
    // Wait a moment for cleanup
    setTimeout(() => {
      // Check if this is still the current request
      if (currentTextId.current !== textId) {
        console.log(`❌ Speech request ${textId} cancelled - newer request exists`);
        return;
      }

      // For long texts, take only the first part to avoid browser limitations
      let textToSpeak = text;
      if (text.length > 800) {
        // Split by sentences and take first few
        const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
        if (sentences.length > 1) {
          textToSpeak = sentences.slice(0, Math.min(3, sentences.length)).join(' ').trim();
          console.log(`Long text detected, using first part (${textToSpeak.length} chars)`);
        } else {
          // If no sentences found, just truncate
          textToSpeak = text.substring(0, 800).trim();
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
        // Double-check this is still the current request
        if (currentTextId.current === textId) {
          console.log(`🔊 Speech started for request ${textId}`);
          setIsSpeaking(true);
        } else {
          console.log(`❌ Speech start cancelled for old request ${textId}`);
          speechSynthesis.cancel();
        }
      };
      
      utterance.onend = () => {
        console.log(`✅ Speech completed for request ${textId}`);
        if (currentTextId.current === textId) {
          setIsSpeaking(false);
        }
      };
      
      utterance.onerror = (event) => {
        console.error(`❌ Speech synthesis error for request ${textId}:`, event);
        if (currentTextId.current === textId) {
          setIsSpeaking(false);
        }
      };

      // Only speak if this is still the current request
      if (currentTextId.current === textId) {
        try {
          speechSynthesis.speak(utterance);
          console.log(`🎤 Started speaking request ${textId}`);
        } catch (error) {
          console.error(`❌ Error starting speech synthesis for request ${textId}:`, error);
          setIsSpeaking(false);
        }
      } else {
        console.log(`❌ Speech request ${textId} cancelled before speaking`);
      }
    }, 200);
  };

  const stop = () => {
    console.log('🛑 Stopping speech synthesis');
    currentTextId.current = ''; // Clear current request
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
