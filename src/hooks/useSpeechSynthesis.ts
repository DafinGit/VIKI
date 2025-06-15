
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
  const chunkQueue = useRef<string[]>([]);
  const currentChunkIndex = useRef<number>(0);

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

  const splitTextIntoChunks = (text: string): string[] => {
    // Split by sentences first
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      // If adding this sentence would exceed 200 characters, start a new chunk
      if (currentChunk.length + sentence.length > 200 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    
    // Add the last chunk if it has content
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 0);
  };

  const speakNextChunk = (textId: string, detectedLanguage: string) => {
    // Check if this is still the current request
    if (currentTextId.current !== textId || currentChunkIndex.current >= chunkQueue.current.length) {
      if (currentTextId.current === textId) {
        console.log(`✅ All chunks completed for request ${textId}`);
        setIsSpeaking(false);
      }
      return;
    }

    const chunkText = chunkQueue.current[currentChunkIndex.current];
    console.log(`🎵 Speaking chunk ${currentChunkIndex.current + 1}/${chunkQueue.current.length}: "${chunkText.substring(0, 50)}..."`);

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utteranceRef.current = utterance;

    const selectedVoice = findBestVoice(voices, detectedLanguage);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎵 Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    }

    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    utterance.lang = detectedLanguage;

    utterance.onstart = () => {
      if (currentTextId.current === textId) {
        if (currentChunkIndex.current === 0) {
          setIsSpeaking(true);
        }
      } else {
        speechSynthesis.cancel();
      }
    };

    utterance.onend = () => {
      if (currentTextId.current === textId) {
        currentChunkIndex.current++;
        // Wait a moment before speaking the next chunk
        setTimeout(() => {
          speakNextChunk(textId, detectedLanguage);
        }, 500);
      }
    };

    utterance.onerror = (event) => {
      console.error(`❌ Speech synthesis error on chunk ${currentChunkIndex.current + 1}:`, event);
      if (currentTextId.current === textId) {
        // Try to continue with the next chunk on error
        currentChunkIndex.current++;
        setTimeout(() => {
          speakNextChunk(textId, detectedLanguage);
        }, 1000);
      }
    };

    if (currentTextId.current === textId) {
      try {
        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error(`❌ Error starting speech synthesis for chunk ${currentChunkIndex.current + 1}:`, error);
        // Try next chunk on error
        currentChunkIndex.current++;
        setTimeout(() => {
          speakNextChunk(textId, detectedLanguage);
        }, 1000);
      }
    }
  };

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

      // Clean the text for speech
      let cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove code markdown
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/❌|✅|🧪|📝|⚡|🔧|💡|😊|😄|🌟|🎉/g, '') // Remove emojis
        .replace(/\n+/g, '. ') // Replace line breaks with periods
        .trim();

      // Split text into manageable chunks
      chunkQueue.current = splitTextIntoChunks(cleanText);
      currentChunkIndex.current = 0;

      console.log(`Split text into ${chunkQueue.current.length} chunks`);

      // Start speaking the first chunk
      speakNextChunk(textId, detectedLanguage);
    }, 200);
  };

  const stop = () => {
    console.log('🛑 Stopping speech synthesis');
    currentTextId.current = ''; // Clear current request
    chunkQueue.current = [];
    currentChunkIndex.current = 0;
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
