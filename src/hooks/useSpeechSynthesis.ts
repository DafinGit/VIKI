
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
      // For longer texts, split into more manageable sentences
      const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
      const chunks: string[] = [];
      
      let currentChunk = '';
      sentences.forEach(sentence => {
        const trimmed = sentence.trim();
        if (trimmed.length <= 160) {
          chunks.push(trimmed);
        } else {
          // Split long sentences at commas or other natural breaks
          const parts = trimmed.split(/,|\s-\s|\s—\s/).map(p => p.trim()).filter(p => p.length > 0);
          let currentChunk = '';
          
          parts.forEach(part => {
            if (currentChunk.length + part.length + 2 <= 160) {
              currentChunk += (currentChunk ? ', ' : '') + part;
            } else {
              if (currentChunk) chunks.push(currentChunk);
              currentChunk = part;
            }
          });
          if (currentChunk) chunks.push(currentChunk);
        }
      });

      console.log(`Split text into ${chunks.length} chunks`);

      let currentChunkIndex = 0;

      const speakNextChunk = () => {
        if (currentChunkIndex >= chunks.length) {
          console.log('🔇 All chunks completed');
          setIsSpeaking(false);
          return;
        }

        const chunk = chunks[currentChunkIndex];
        console.log(`🎵 Speaking chunk ${currentChunkIndex + 1}/${chunks.length}: "${chunk.substring(0, 50)}..."`);

        const utterance = new SpeechSynthesisUtterance(chunk);
        utteranceRef.current = utterance;

        // Use detected language instead of config language for voice selection
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
          if (currentChunkIndex === 0) {
            console.log('🔊 Speech started');
            setIsSpeaking(true);
          }
        };
        
        utterance.onend = () => {
          console.log(`✅ Chunk ${currentChunkIndex + 1} completed`);
          currentChunkIndex++;
          // Small delay between chunks for better reliability
          setTimeout(() => {
            speakNextChunk();
          }, 300);
        };
        
        utterance.onerror = (event) => {
          console.error(`❌ Speech synthesis error on chunk ${currentChunkIndex + 1}:`, event);
          console.log('🔄 Attempting to continue with next chunk...');
          currentChunkIndex++;
          setTimeout(() => {
            speakNextChunk();
          }, 500);
        };

        try {
          speechSynthesis.speak(utterance);
        } catch (error) {
          console.error('❌ Error starting speech synthesis:', error);
          setIsSpeaking(false);
        }
      };

      // Start speaking the first chunk
      speakNextChunk();
    }, 300);
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
