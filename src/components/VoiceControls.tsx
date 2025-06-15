
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { supportedLanguages } from './LanguageSelector';

interface VoiceControlsProps {
  isSpeaking: boolean;
  currentLanguage: string;
  onTestVoice: () => void;
  onStopSpeech: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isSpeaking,
  currentLanguage,
  onTestVoice,
  onStopSpeech
}) => {
  const testVoice = () => {
    const language = supportedLanguages.find(lang => lang.code === currentLanguage);
    const testMessage = language?.code.startsWith('en') 
      ? "VIKI Neural System is now online and ready for interaction."
      : language?.code === 'es-ES' 
      ? "El Sistema Neural VIKI está ahora en línea y listo para la interacción."
      : language?.code === 'fr-FR'
      ? "Le Système Neural VIKI est maintenant en ligne et prêt pour l'interaction."
      : language?.code === 'de-DE'
      ? "Das VIKI Neural System ist jetzt online und bereit für die Interaktion."
      : language?.code === 'it-IT'
      ? "Il Sistema Neurale VIKI è ora online e pronto per l'interazione."
      : language?.code === 'pt-BR'
      ? "O Sistema Neural VIKI está agora online e pronto para interação."
      : language?.code === 'ro-RO'
      ? "Sistemul Neural VIKI este acum online și gata pentru interacțiune."
      : language?.code === 'ru-RU'
      ? "Нейронная система ВИКИ теперь онлайн и готова к взаимодействию."
      : language?.code === 'ja-JP'
      ? "VIKIニューラルシステムがオンラインになり、対話の準備が整いました。"
      : language?.code === 'ko-KR'
      ? "VIKI 신경 시스템이 온라인 상태이며 상호 작용할 준비가 되었습니다."
      : language?.code === 'zh-CN'
      ? "VIKI神经系统现已上线，准备进行交互。"
      : language?.code === 'ar-SA'
      ? "نظام VIKI العصبي متصل الآن وجاهز للتفاعل."
      : language?.code === 'hi-IN'
      ? "VIKI न्यूरल सिस्टम अब ऑनलाइन है और बातचीत के लिए तैयार है।"
      : "VIKI Neural System is now online and ready for interaction.";
    
    onTestVoice();
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={testVoice}
        disabled={isSpeaking}
        className="flex-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 font-mono"
      >
        <Volume2 className="w-4 h-4 mr-2" />
        TEST VOICE
      </Button>
      <Button
        onClick={onStopSpeech}
        disabled={!isSpeaking}
        className="bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30 font-mono"
      >
        <VolumeX className="w-4 h-4" />
      </Button>
    </div>
  );
};
