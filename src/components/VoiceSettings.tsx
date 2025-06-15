import React from 'react';
import { Slider } from '@/components/ui/slider';
import { SpeechConfig } from '@/types/speechConfig';

interface VoiceSettingsProps {
  config: SpeechConfig;
  onConfigChange: (config: Partial<SpeechConfig>) => void;
}

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  config,
  onConfigChange
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-sm text-cyan-300 font-mono">SPEECH RATE: {config.rate}</label>
        <Slider
          value={[config.rate]}
          onValueChange={(value) => onConfigChange({ rate: value[0] })}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-cyan-300 font-mono">VOICE PITCH: {config.pitch}</label>
        <Slider
          value={[config.pitch]}
          onValueChange={(value) => onConfigChange({ pitch: value[0] })}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>
    </div>
  );
};
