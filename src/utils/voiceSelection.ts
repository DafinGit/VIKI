
export const findBestVoice = (voices: SpeechSynthesisVoice[], targetLanguage: string): SpeechSynthesisVoice | null => {
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

export const logVoiceAnalysis = (voices: SpeechSynthesisVoice[]) => {
  console.log('=== VOICE ANALYSIS ===');
  console.log('Total voices found:', voices.length);
  
  // Group voices by language for better analysis
  const voicesByLang = voices.reduce((acc, voice) => {
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
};
