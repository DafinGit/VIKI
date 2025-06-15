
// Language detection patterns
const LANGUAGE_PATTERNS = {
  'en': /^[a-zA-Z\s.,!?'"():;-]+$/,
  'ro': /[ăâîșțĂÂÎȘȚ]/,
  'es': /[ñáéíóúüÑÁÉÍÓÚÜ]/,
  'fr': /[àâäçéèêëïîôùûüÿÀÂÄÇÉÈÊËÏÎÔÙÛÜŸ]/,
  'de': /[äöüßÄÖÜ]/,
  'it': /[àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/,
};

export const detectTextLanguage = (text: string): string => {
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
