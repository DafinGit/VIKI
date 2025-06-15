
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supportedLanguages, Language } from '../constants/languages';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div>
      <label className="text-sm text-cyan-300 font-mono mb-2 block">LANGUAGE PROTOCOL</label>
      <Select value={selectedLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="bg-black/30 border-cyan-500/40 text-cyan-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-cyan-500/40">
          {supportedLanguages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-cyan-100">
              {lang.flag} {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
