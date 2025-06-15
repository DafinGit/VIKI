
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface SpeechControlsProps {
  onVoiceInput: (text: string) => void;
  isVideoEnabled: boolean;
  onToggleVideo: () => void;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({
  onVoiceInput,
  isVideoEnabled,
  onToggleVideo
}) => {
  const speech = useSpeechSynthesis();
  const recognition = useSpeechRecognition();

  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' }
  ];

  React.useEffect(() => {
    if (recognition.transcript) {
      onVoiceInput(recognition.transcript);
      recognition.resetTranscript();
    }
  }, [recognition.transcript, onVoiceInput, recognition]);

  const handleLanguageChange = (languageCode: string) => {
    speech.setConfig(prev => ({ ...prev, language: languageCode }));
    recognition.setConfig(prev => ({ ...prev, language: languageCode }));
  };

  const testVoice = () => {
    const language = supportedLanguages.find(lang => lang.code === speech.config.language);
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
    
    speech.speak(testMessage);
  };

  return (
    <Card className="p-4 bg-black/40 backdrop-blur-md border border-cyan-500/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium font-mono">NEURAL VOICE INTERFACE</span>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              I, ROBOT MODE
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {speech.isSpeaking && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
                SPEAKING
              </Badge>
            )}
            {recognition.isListening && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse">
                LISTENING
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm text-cyan-300 font-mono mb-2 block">LANGUAGE PROTOCOL</label>
              <Select value={speech.config.language} onValueChange={handleLanguageChange}>
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

            <div className="space-y-2">
              <label className="text-sm text-cyan-300 font-mono">SPEECH RATE: {speech.config.rate}</label>
              <Slider
                value={[speech.config.rate]}
                onValueChange={(value) => speech.setConfig(prev => ({ ...prev, rate: value[0] }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-cyan-300 font-mono">VOICE PITCH: {speech.config.pitch}</label>
              <Slider
                value={[speech.config.pitch]}
                onValueChange={(value) => speech.setConfig(prev => ({ ...prev, pitch: value[0] }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={testVoice}
                disabled={speech.isSpeaking}
                className="flex-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30 font-mono"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                TEST VOICE
              </Button>
              <Button
                onClick={speech.stop}
                disabled={!speech.isSpeaking}
                className="bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30 font-mono"
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            </div>

            {recognition.isSupported && (
              <div className="flex gap-2">
                <Button
                  onClick={recognition.isListening ? recognition.stopListening : recognition.startListening}
                  className={`flex-1 font-mono ${
                    recognition.isListening 
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
                  }`}
                >
                  {recognition.isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {recognition.isListening ? 'STOP LISTENING' : 'START LISTENING'}
                </Button>
              </div>
            )}

            <Button
              onClick={onToggleVideo}
              className={`w-full font-mono ${
                isVideoEnabled 
                  ? 'bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30' 
                  : 'bg-gray-500/20 text-gray-300 border-gray-500/40 hover:bg-gray-500/30'
              }`}
            >
              {isVideoEnabled ? <Camera className="w-4 h-4 mr-2" /> : <CameraOff className="w-4 h-4 mr-2" />}
              {isVideoEnabled ? 'DISABLE CAMERA' : 'ENABLE CAMERA'}
            </Button>

            {recognition.interimTranscript && (
              <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded text-blue-300 text-xs font-mono">
                Listening: {recognition.interimTranscript}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
