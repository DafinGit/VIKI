
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface MessageInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  selectedImage: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  input,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isLoading,
}) => {
  return (
    <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
      <div className="flex gap-3">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Ask DeepSeek-R1 anything... Try: 'Solve x² + 5x + 6 = 0'"
          className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || isLoading}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 px-6"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
