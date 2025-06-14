
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Activity, Cpu, Brain, Zap } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState(false);

  const sendMessage = async (content: string) => {
    const userMessage: Message = { 
      role: 'user' as const, 
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Chat'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: userMessage.role, content: userMessage.content }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;
      
      // Extract thinking process if present
      const thinkingMatch = assistantResponse.match(/<think>([\s\S]*?)<\/think>/);
      const thinking = thinkingMatch ? thinkingMatch[1].trim() : '';
      const content = assistantResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      const assistantMessage: Message = { 
        role: 'assistant' as const, 
        content,
        thinking: thinking || undefined,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { 
        role: 'assistant' as const, 
        content: '❌ NEURAL COMMUNICATION ERROR: Unable to establish connection with DeepSeek reasoning core. Please verify neural link integrity and retry transmission.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-mono">
                NEURAL INTERFACE
              </h2>
              <p className="text-blue-300 font-mono text-sm">Interactive Communication Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-mono">
              <Brain className="w-4 h-4 mr-1" />
              Free Tier
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono">
              <Activity className="w-4 h-4 mr-1" />
              Multimodal
            </Badge>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 font-mono text-sm">
            NEURAL STATUS: Advanced conversational AI with enhanced reasoning capabilities. Direct neural interface to DeepSeek-R1 cognitive processing matrix.
          </p>
        </div>
      </Card>

      {/* Chat Controls */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-blue-500/30 shadow-lg shadow-blue-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-mono">
              COMMUNICATION CONTROLS
            </h3>
          </div>
          <button
            onClick={() => setShowThinking(!showThinking)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
              showThinking 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' 
                : 'bg-black/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              {showThinking ? 'HIDE' : 'SHOW'} THINKING PROCESS
            </div>
          </button>
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-600/30">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono text-sm font-semibold">
              NEURAL LINK STATUS: ACTIVE
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
            <span className="text-gray-400 font-mono text-xs">DEEPSEEK-R1 ONLINE</span>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <MessageList 
        messages={messages} 
        showThinking={showThinking} 
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      {/* Input */}
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};
