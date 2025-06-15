
// Language detection patterns - simplified to only Romanian and English
const LANGUAGE_PATTERNS = {
  'en': /^[a-zA-Z\s.,!?'"():;-]+$/,
  'ro': /[ăâîșțĂÂÎȘȚ]/
};

export const detectTextLanguage = (text: string): string => {
  // Remove punctuation and convert to lowercase for analysis
  const cleanText = text.replace(/[.,!?'"():;-]/g, '').toLowerCase();
  
  // Check for Romanian special characters first
  if (LANGUAGE_PATTERNS.ro.test(text)) {
    console.log('Detected language: Romanian (special characters found)');
    return 'ro-RO';
  }
  
  // Check for common Romanian words
  const romanianWords = ['salut', 'bună', 'ziua', 'este', 'sunt', 'pentru', 'cu', 'la', 'de', 'și', 'în', 'că', 'nu', 'mai', 'doar', 'foarte', 'cum', 'când', 'unde'];
  const englishWords = ['hello', 'hi', 'the', 'and', 'is', 'are', 'you', 'i', 'can', 'help', 'assist', 'today', 'how', 'what', 'where', 'when', 'why', 'this', 'that'];
  
  const words = cleanText.split(/\s+/);
  
  let romanianScore = 0;
  let englishScore = 0;
  
  words.forEach(word => {
    if (romanianWords.includes(word)) romanianScore++;
    if (englishWords.includes(word)) englishScore++;
  });
  
  if (romanianScore > englishScore) {
    console.log(`Detected language: Romanian (word score: ${romanianScore})`);
    return 'ro-RO';
  }
  
  if (englishScore > 0) {
    console.log(`Detected language: English (word score: ${englishScore})`);
    return 'en-GB';
  }
  
  // Default to English GB if no clear detection
  console.log('No clear language detected, defaulting to English GB');
  return 'en-GB';
};
