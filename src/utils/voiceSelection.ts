
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
    
    // CRITICAL: Strong preference for female voices
    const femaleIndicators = [
      'female', 'woman', 'girl', 'lady', 'fem',
      // Romanian female names
      'ioana', 'maria', 'ana', 'elena', 'carmen', 'alexandra', 'cristina', 'mihaela', 'diana', 'laura',
      // English female names  
      'susan', 'hazel', 'kate', 'emma', 'sarah', 'emily', 'sophie', 'alice', 'zira', 'samantha', 'victoria', 'fiona'
    ];
    
    const maleIndicators = [
      'male', 'man', 'boy', 'gentleman', 
      // Romanian male names
      'andrei', 'george', 'daniel', 'alexandru', 'mihai', 'stefan', 'cristian', 'adrian', 'florin',
      // English male names
      'david', 'mark', 'paul', 'james', 'thomas', 'alex', 'michael', 'robert'
    ];
    
    const isFemale = femaleIndicators.some(indicator => voiceName.includes(indicator));
    const isMale = maleIndicators.some(indicator => voiceName.includes(indicator));
    
    if (isFemale) {
      score += 300; // VERY strong preference for female voices
      console.log(`🎀 Female voice detected: ${voice.name} - BONUS +300`);
    } else if (isMale) {
      score -= 200; // Heavy penalty for clearly male voices
      console.log(`👨 Male voice detected: ${voice.name} - PENALTY -200`);
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
          voiceName.includes('kate') || voiceName.includes('zira') ||
          voiceName.includes('fiona') || voiceName.includes('samantha')) {
        score += 250; // Extra bonus for known good British female voices
      }
    }
    
    // For Romanian, prefer Romanian voices
    if (langCode === 'ro') {
      if (voiceName.includes('romania') || voiceName.includes('romanian')) {
        score += 150;
      }
      
      // CRITICAL: Heavy bonus for female Romanian voices
      if (voiceName.includes('ioana')) {
        score += 400; // Maximum bonus for Ioana (female Romanian voice)
        console.log(`🌟 PERFECT MATCH: Ioana voice - BONUS +400`);
      } else if ((voiceName.includes('romania') || voiceName.includes('romanian')) && isFemale) {
        score += 350; // Very high bonus for other female Romanian voices
      }
      
      // CRITICAL: Heavy penalty for male Romanian voices
      if (voiceName.includes('andrei')) {
        score -= 400; // Maximum penalty for Andrei (male Romanian voice)
        console.log(`❌ AVOIDING: Andrei voice - PENALTY -400`);
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
  
  console.log('=== TOP 10 VOICE CANDIDATES ===');
  scoredVoices.slice(0, 10).forEach(({ voice, score }, index) => {
    const genderGuess = ['ioana', 'maria', 'ana', 'susan', 'hazel', 'kate', 'emma', 'sarah', 'zira', 'fiona', 'samantha', 'victoria']
      .some(name => voice.name.toLowerCase().includes(name)) ? '👩 Female' : 
      ['andrei', 'george', 'daniel', 'david', 'mark', 'paul', 'james', 'thomas', 'alex', 'michael']
      .some(name => voice.name.toLowerCase().includes(name)) ? '👨 Male' : '❓ Unknown';
    
    const priority = index === 0 ? '🥇 SELECTED' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : `${index + 1}th`;
    console.log(`${priority}: ${voice.name} (${voice.lang}) - Score: ${score}, ${genderGuess}, Local: ${voice.localService}, Default: ${voice.default}`);
  });
  
  const bestVoice = scoredVoices[0]?.voice;
  
  if (bestVoice && scoredVoices[0].score > 0) {
    console.log(`✅ FINAL SELECTION: ${bestVoice.name} (${bestVoice.lang}) - Score: ${scoredVoices[0].score}`);
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
