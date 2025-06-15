// src/constants/languages.ts
export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'ro-RO', name: 'Romanian', flag: '🇷🇴' }
];
