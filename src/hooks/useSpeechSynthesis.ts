
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

  const cleanTextForSpeech = (text: string): string => {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/---+/g, '') // Remove horizontal rules
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      
      // Remove special characters and emojis
      .replace(/[🌳✨🎄🌟🎉🔧💡😊😄❌✅🧪📝⚡🎀👩👨❓]/g, '') // Remove emojis
      .replace(/[•·]/g, '') // Remove bullet points
      
      // Clean up structure
      .replace(/\n+/g, '. ') // Replace line breaks with periods
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\.+/g, '.') // Replace multiple periods with single period
      .replace(/\.\s*\./g, '.') // Remove double periods
      
      // Remove remaining formatting artifacts
      .replace(/\s*-\s*/g, '. ') // Replace dashes with periods
      .replace(/:\s*$/g, '.') // Replace trailing colons with periods
      
      .trim();
  };

  const splitTextIntoChunks = (text: string): string[] => {
    // Split by sentences first, but handle multiple sentence endings
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();
      if (!cleanSentence) continue;
      
      // If adding this sentence would exceed 180 characters, start a new chunk
      if (currentChunk.length + cleanSentence.length > 180 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = cleanSentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + cleanSentence;
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
        }, 400);
      }
    };

    utterance.onerror = (event) => {
      console.error(`❌ Speech synthesis error on chunk ${currentChunkIndex.current + 1}:`, event);
      if (currentTextId.current === textId) {
        // Try to continue with the next chunk on error
        currentChunkIndex.current++;
        setTimeout(() => {
          speakNextChunk(textId, detectedLanguage);
        }, 800);
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
        }, 800);
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
    console.log(`Original text length: ${text.length} characters`);
    console.log(`Current config language: ${config.language}`);

    // Clean the text thoroughly for speech
    const cleanText = cleanTextForSpeech(text);
    console.log(`Cleaned text length: ${cleanText.length} characters`);
    console.log(`Cleaned text preview: "${cleanText.substring(0, 100)}..."`);

    if (!cleanText.trim()) {
      console.log('❌ No speakable content after cleaning');
      return;
    }

    // Detect the actual language of the text
    const detectedLanguage = detectTextLanguage(cleanText);
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

      // Split text into manageable chunks
      chunkQueue.current = splitTextIntoChunks(cleanText);
      currentChunkIndex.current = 0;

      console.log(`Split text into ${chunkQueue.current.length} chunks`);
      chunkQueue.current.forEach((chunk, index) => {
        console.log(`Chunk ${index + 1}: "${chunk.substring(0, 60)}..."`);
      });

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
