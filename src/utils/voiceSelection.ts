
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
    
    // Skip voices that are not Romanian or English
    if (voiceLangCode !== 'ro' && voiceLangCode !== 'en') {
      return -1000; // Heavily penalize non-supported languages
    }
    
    // Exact language and region match
    if (voiceLang === targetLanguage.toLowerCase()) {
      score += 100;
    }
    // Same language code
    else if (voiceLangCode === langCode) {
      score += 50;
    }
    
    // PRIORITY: Female voices for VIKI (applies to both languages)
    const femaleIndicators = ['female', 'woman', 'girl', 'ioana', 'maria', 'ana', 'elena', 'carmen', 
                             'susan', 'hazel', 'kate', 'emma', 'sarah', 'emily', 'sophie', 'alice', 'zira'];
    const maleIndicators = ['male', 'man', 'boy', 'andrei', 'george', 'daniel', 'david', 'mark', 'paul'];
    
    const isFemale = femaleIndicators.some(indicator => voiceName.includes(indicator));
    const isMale = maleIndicators.some(indicator => voiceName.includes(indicator));
    
    if (isFemale) {
      score += 150; // Strong preference for female voices
      console.log(`🎀 Female voice detected: ${voice.name}`);
    } else if (isMale) {
      score -= 50; // Penalize clearly male voices
    }
    
    // Bonus for local/native voices
    if (voice.localService) {
      score += 30;
    }
    
    // Bonus for default voices
    if (voice.default) {
      score += 20;
    }
    
    // For English, only allow British voices
    if (langCode === 'en') {
      // Heavily penalize non-British English voices
      if (voiceName.includes('united states') || voiceName.includes('america') || 
          voiceName.includes('australia') || voiceName.includes('canada') ||
          voiceName.includes('india') || voiceName.includes('south africa')) {
        score -= 200;
      }
      
      // Heavily penalize voices with Romanian or other foreign accents
      if (voiceName.includes('romania') || voiceName.includes('romanian') || 
          voiceName.includes('andrei') || voiceName.includes('ioana')) {
        score -= 500; // Very heavy penalty
      }
      
      // Bonus for clearly British voices
      if (voiceName.includes('british') || voiceName.includes('uk') || 
          voiceName.includes('england') || voiceName.includes('gb') ||
          voiceRegion === 'gb') {
        score += 100;
      }
      
      // Special bonus for good British female voices
      if (voiceName.includes('hazel') || voiceName.includes('susan') || 
          voiceName.includes('kate') || voiceName.includes('zira')) {
        score += 200; // Extra bonus for known good British female voices
      }
    }
    
    // For Romanian, prefer Romanian voices
    if (langCode === 'ro') {
      if (voiceName.includes('andrei') || voiceName.includes('ioana') || 
          voiceName.includes('romania') || voiceName.includes('romanian')) {
        score += 100;
      }
      
      // Special bonus for female Romanian voices
      if (voiceName.includes('ioana') || (voiceName.includes('romania') && isFemale)) {
        score += 200; // Extra bonus for Romanian female voices
      }
      
      // Penalize non-Romanian voices for Romanian text
      if (!voiceName.includes('romania') && !voiceName.includes('romanian') && 
          !voiceName.includes('andrei') && !voiceName.includes('ioana')) {
        score -= 100;
      }
    }
    
    return score;
  };
  
  // Score all voices and find the best match
  const scoredVoices = voices
    .map(voice => ({
      voice,
      score: scoreVoice(voice)
    }))
    .filter(({ score }) => score > -500) // Filter out heavily penalized voices
    .sort((a, b) => b.score - a.score);
  
  console.log('Top 5 voice candidates:');
  scoredVoices.slice(0, 5).forEach(({ voice, score }) => {
    const genderGuess = ['ioana', 'maria', 'ana', 'susan', 'hazel', 'kate', 'emma', 'sarah', 'zira']
      .some(name => voice.name.toLowerCase().includes(name)) ? '👩 Female' : 
      ['andrei', 'george', 'daniel', 'david', 'mark', 'paul']
      .some(name => voice.name.toLowerCase().includes(name)) ? '👨 Male' : '❓ Unknown';
    
    console.log(`- ${voice.name} (${voice.lang}) - Score: ${score}, ${genderGuess}, Local: ${voice.localService}, Default: ${voice.default}`);
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
  console.log('=== VOICE ANALYSIS (Romanian & English GB Only) ===');
  
  // Filter to only show Romanian and English voices
  const relevantVoices = voices.filter(voice => {
    const langCode = voice.lang.split('-')[0].toLowerCase();
    return langCode === 'ro' || langCode === 'en';
  });
  
  console.log('Total relevant voices found:', relevantVoices.length);
  
  // Group voices by language
  const voicesByLang = relevantVoices.reduce((acc, voice) => {
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
