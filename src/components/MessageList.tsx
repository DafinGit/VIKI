
import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot, User, Loader2 } from 'lucide-react';
import { ThinkingProcess } from './ThinkingProcess';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: Date;
  image?: string;
}

interface MessageListProps {
  messages: Message[];
  showThinking: boolean;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  showThinking,
  isLoading,
  messagesEndRef,
}) => {
  return (
    <Card className="h-96 overflow-y-auto p-4 bg-white/10 backdrop-blur-md border-white/20">
      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Start a conversation with DeepSeek-R1!</p>
            <p className="text-sm mt-2">Try asking about math problems, coding challenges, or upload images for analysis.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] space-y-2 ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Thinking Process */}
              {message.thinking && showThinking && (
                <ThinkingProcess thinking={message.thinking} />
              )}
              
              {/* Main Message */}
              <div className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30' 
                  : 'bg-gray-800/50 text-gray-100 border border-gray-600/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.image && (
                  <div className="mb-3">
                    <img 
                      src={message.image} 
                      alt="User uploaded" 
                      className="max-w-full max-h-48 rounded-lg"
                    />
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="text-gray-300">DeepSeek-R1 is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};
