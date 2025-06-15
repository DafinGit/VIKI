
import { useState, useEffect, useRef } from 'react';

export interface SpeechConfig {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

// Language detection patterns
const LANGUAGE_PATTERNS = {
  'en': /^[a-zA-Z\s.,!?'"():;-]+$/,
  'ro': /[ăâîșțĂÂÎȘȚ]/,
  'es': /[ñáéíóúüÑÁÉÍÓÚÜ]/,
  'fr': /[àâäçéèêëïîôùûüÿÀÂÄÇÉÈÊËÏÎÔÙÛÜŸ]/,
  'de': /[äöüßÄÖÜ]/,
  'it': /[àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/,
};

const detectTextLanguage = (text: string): string => {
  // Remove punctuation and convert to lowercase for analysis
  const cleanText = text.replace(/[.,!?'"():;-]/g, '').toLowerCase();
  
  // Check for specific language characters
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (lang !== 'en' && pattern.test(text)) {
      console.log(`Detected language: ${lang} (special characters found)`);
      return lang === 'ro' ? 'ro-RO' : 
             lang === 'es' ? 'es-ES' :
             lang === 'fr' ? 'fr-FR' :
             lang === 'de' ? 'de-DE' :
             lang === 'it' ? 'it-IT' : 'en-US';
    }
  }
  
  // Check for common words in different languages
  const romanianWords = ['salut', 'buna', 'ziua', 'este', 'sunt', 'pentru', 'cu', 'la', 'de', 'și', 'în'];
  const englishWords = ['hello', 'hi', 'the', 'and', 'is', 'are', 'you', 'i', 'can', 'help', 'assist', 'today', 'how'];
  const spanishWords = ['hola', 'el', 'la', 'y', 'es', 'son', 'para', 'con', 'en', 'de'];
  const frenchWords = ['bonjour', 'le', 'la', 'et', 'est', 'sont', 'pour', 'avec', 'dans', 'de'];
  const germanWords = ['hallo', 'der', 'die', 'das', 'und', 'ist', 'sind', 'für', 'mit', 'in'];
  
  const words = cleanText.split(/\s+/);
  
  let romanianScore = 0;
  let englishScore = 0;
  let spanishScore = 0;
  let frenchScore = 0;
  let germanScore = 0;
  
  words.forEach(word => {
    if (romanianWords.includes(word)) romanianScore++;
    if (englishWords.includes(word)) englishScore++;
    if (spanishWords.includes(word)) spanishScore++;
    if (frenchWords.includes(word)) frenchScore++;
    if (germanWords.includes(word)) germanScore++;
  });
  
  const maxScore = Math.max(romanianScore, englishScore, spanishScore, frenchScore, germanScore);
  
  if (maxScore > 0) {
    if (romanianScore === maxScore) {
      console.log(`Detected language: Romanian (word score: ${romanianScore})`);
      return 'ro-RO';
    }
    if (spanishScore === maxScore) {
      console.log(`Detected language: Spanish (word score: ${spanishScore})`);
      return 'es-ES';
    }
    if (frenchScore === maxScore) {
      console.log(`Detected language: French (word score: ${frenchScore})`);
      return 'fr-FR';
    }
    if (germanScore === maxScore) {
      console.log(`Detected language: German (word score: ${germanScore})`);
      return 'de-DE';
    }
    if (englishScore === maxScore) {
      console.log(`Detected language: English (word score: ${englishScore})`);
      return 'en-US';
    }
  }
  
  // Default to English if no clear detection
  console.log('No clear language detected, defaulting to English');
  return 'en-US';
};

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
      console.log('=== VOICE ANALYSIS ===');
      console.log('Total voices found:', availableVoices.length);
      
      // Group voices by language for better analysis
      const voicesByLang = availableVoices.reduce((acc, voice) => {
        const lang = voice.lang.split('-')[0];
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(voice);
        return acc;
      }, {} as Record<string, SpeechSynthesisVoice[]>);
      
      Object.entries(voicesByLang).forEach(([lang, voices]) => {
        console.log(`${lang.toUpperCase()} voices:`, voices.map(v => 
          `${v.name} (${v.lang}) - Local: ${v.localService}, Default: ${v.default}`
        ));
      });
      
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

    const langCode = targetLanguage.split('-')[0].toLowerCase();
    const regionCode = targetLanguage.split('-')[1]?.toLowerCase();
    
    console.log(`=== FINDING VOICE FOR ${targetLanguage} ===`);
    console.log(`Language code: ${langCode}, Region: ${regionCode || 'any'}`);
    
    // Create scoring system for voice selection
    const scoreVoice = (voice: SpeechSynthesisVoice) => {
      let score = 0;
      const voiceLang = voice.lang.toLowerCase();
      const voiceLangCode = voiceLang.split('-')[0];
      const voiceRegion = voiceLang.split('-')[1];
      const voiceName = voice.name.toLowerCase();
      
      // Exact language and region match
      if (voiceLang === targetLanguage.toLowerCase()) {
        score += 100;
      }
      // Same language code
      else if (voiceLangCode === langCode) {
        score += 50;
      }
      
      // Bonus for local/native voices
      if (voice.localService) {
        score += 30;
      }
      
      // Bonus for default voices
      if (voice.default) {
        score += 20;
      }
      
      // CRITICAL: Filter out voices with wrong accent/region
      if (langCode === 'en') {
        // Heavily penalize voices that might have Romanian or other foreign accents
        if (voiceName.includes('romania') || voiceName.includes('romanian') || 
            voiceName.includes('andrei') || voiceName.includes('ioana')) {
          score -= 200; // Heavy penalty
        }
        
        // Penalize other potentially wrong accents for English
        if (voiceName.includes('india') && !targetLanguage.includes('IN')) {
          score -= 100;
        }
        
        // Bonus for clearly native English voices
        if (voiceName.includes('david') || voiceName.includes('mark') || 
            voiceName.includes('zira') || voiceName.includes('hazel') ||
            voiceName.includes('susan') || voiceName.includes('george')) {
          score += 50;
        }
        
        // Prefer specific regional voices
        if (regionCode === 'us' && (voiceName.includes('united states') || voiceName.includes('us') || voiceName.includes('american'))) {
          score += 25;
        }
        if (regionCode === 'gb' && (voiceName.includes('british') || voiceName.includes('uk') || voiceName.includes('england'))) {
          score += 25;
        }
      }
      
      // For Romanian, prefer Romanian voices
      if (langCode === 'ro') {
        if (voiceName.includes('andrei') || voiceName.includes('ioana') || voiceName.includes('romania')) {
          score += 50;
        }
      }
      
      // Prefer voices with clear regional indicators
      if (regionCode && voiceRegion === regionCode) {
        score += 15;
      }
      
      return score;
    };
    
    // Score all voices and find the best match
    const scoredVoices = voices.map(voice => ({
      voice,
      score: scoreVoice(voice)
    })).sort((a, b) => b.score - a.score);
    
    console.log('Top 5 voice candidates:');
    scoredVoices.slice(0, 5).forEach(({ voice, score }) => {
      console.log(`- ${voice.name} (${voice.lang}) - Score: ${score}, Local: ${voice.localService}, Default: ${voice.default}`);
    });
    
    const bestVoice = scoredVoices[0]?.voice;
    
    if (bestVoice && scoredVoices[0].score > 0) {
      console.log(`✅ Selected: ${bestVoice.name} (${bestVoice.lang}) - Score: ${scoredVoices[0].score}`);
      return bestVoice;
    }
    
    console.log('❌ No suitable voice found');
    return null;
  };

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
    const selectedVoice = findBestVoice(detectedLanguage);

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
