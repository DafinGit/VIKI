
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
  const getTestMessage = (languageCode: string) => {
    switch (languageCode) {
      case 'ro-RO':
        return "Salut! Sistemul neural VIKI este acum online și pregătit pentru conversație în limba română.";
      case 'en-US':
      case 'en-GB':
        return "Hello! VIKI Neural System is now online and ready for interaction.";
      case 'es-ES':
        return "¡Hola! El Sistema Neural VIKI está ahora en línea y listo para la interacción.";
      case 'fr-FR':
        return "Bonjour! Le Système Neural VIKI est maintenant en ligne et prêt pour l'interaction.";
      case 'de-DE':
        return "Hallo! Das VIKI Neural System ist jetzt online und bereit für die Interaktion.";
      case 'it-IT':
        return "Ciao! Il Sistema Neurale VIKI è ora online e pronto per l'interazione.";
      case 'pt-BR':
        return "Olá! O Sistema Neural VIKI está agora online e pronto para interação.";
      case 'ru-RU':
        return "Привет! Нейронная система ВИКИ теперь онлайн и готова к взаимодействию.";
      case 'ja-JP':
        return "こんにちは！VIKIニューラルシステムがオンラインになり、対話の準備が整いました。";
      case 'ko-KR':
        return "안녕하세요! VIKI 신경 시스템이 온라인 상태이며 상호 작용할 준비가 되었습니다.";
      case 'zh-CN':
        return "你好！VIKI神经系统现已上线，准备进行交互。";
      case 'ar-SA':
        return "مرحبا! نظام VIKI العصبي متصل الآن وجاهز للتفاعل.";
      case 'hi-IN':
        return "नमस्ते! VIKI न्यूरल सिस्टम अब ऑनलाइन है और बातचीत के लिए तैयार है।";
      default:
        return "Hello! VIKI Neural System is now online and ready for interaction.";
    }
  };

  const handleTestVoice = () => {
    console.log('Testing voice for language:', currentLanguage);
    onTestVoice();
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleTestVoice}
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
