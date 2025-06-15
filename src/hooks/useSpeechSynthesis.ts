
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
      
      // Penalties for potentially wrong accents
      if (langCode === 'en') {
        // Penalize English voices that might have wrong accents
        if (voiceName.includes('romania') || voiceName.includes('romanian') || 
            voiceName.includes('india') && !targetLanguage.includes('IN')) {
          score -= 50;
        }
        
        // Prefer specific regional voices
        if (regionCode === 'us' && (voiceName.includes('united states') || voiceName.includes('us') || voiceName.includes('american'))) {
          score += 25;
        }
        if (regionCode === 'gb' && (voiceName.includes('british') || voiceName.includes('uk') || voiceName.includes('england'))) {
          score += 25;
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
    
    if (bestVoice) {
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
    console.log(`Target language: ${config.language}`);

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find the best voice for the selected language
    const selectedVoice = findBestVoice(config.language);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎵 Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      console.log(`Voice details: Local=${selectedVoice.localService}, Default=${selectedVoice.default}`);
    } else {
      console.log(`⚠️ No specific voice found for ${config.language}, using browser default`);
    }

    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    utterance.lang = config.language;

    console.log(`Speech settings: Rate=${config.rate}, Pitch=${config.pitch}, Volume=${config.volume}`);

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
