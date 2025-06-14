
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image as ImageIcon, X } from 'lucide-react';

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
  selectedImage,
  onImageSelect,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Image Preview */}
      {selectedImage && (
        <Card className="p-3 bg-white/10 backdrop-blur-md border-white/20">
          <div className="flex items-center gap-3">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="text-white text-sm">Image ready to send</p>
              <p className="text-gray-400 text-xs">This image will be included with your next message</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRemoveImage}
              className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Input */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="hidden"
            />
          </div>
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Ask DeepSeek-R1 anything... Try: 'Solve x² + 5x + 6 = 0' or upload an image for analysis"
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
    </>
  );
};
