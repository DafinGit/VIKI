
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Cpu, Activity, Zap } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatControls } from './ChatControls';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thinking?: string;
}

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState('deepseek/deepseek-r1');
  const [temperature, setTemperature] = useState(0.1);
  const [maxTokens, setMaxTokens] = useState(8000);
  const [input, setInput] = useState('');
  const [showThinking, setShowThinking] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    'deepseek/deepseek-r1',
    'openai/gpt-4o',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-2.0-flash-exp:free',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      console.log('=== SENDING CHAT MESSAGE ===');
      console.log('Model:', currentModel);
      console.log('Message:', input);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Neural Interface Chat'
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: input.trim()
            }
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Chat response received');

      if (data.choices?.[0]?.message?.content) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date(),
          thinking: data.choices[0].message.reasoning || undefined
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ **Neural Interface Error**\n\nError: ${error.message}\n\nPlease check your API key and try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const toggleThinking = () => {
    setShowThinking(prev => !prev);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                NEURAL INTERFACE SYSTEM
              </h2>
              <p className="text-cyan-300 text-sm font-mono">Advanced Reasoning Engine v2.1</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-mono">
              <Cpu className="w-4 h-4 mr-1" />
              AI ACTIVE
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono">
              <Zap className="w-4 h-4 mr-1" />
              ONLINE
            </Badge>
          </div>
        </div>
        
        <div className="border-l-4 border-cyan-400 pl-4">
          <p className="text-gray-300 font-mono text-sm leading-relaxed">
            Advanced conversational AI with deep reasoning capabilities and chain-of-thought processing.
            <br />
            <span className="text-cyan-400">Initialize neural conversation protocol to begin cognitive interaction.</span>
          </p>
        </div>
      </Card>

      <ChatControls
        showThinking={showThinking}
        onToggleThinking={toggleThinking}
      />

      <MessageList
        messages={messages}
        showThinking={showThinking}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        input={input}
        onInputChange={setInput}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
        selectedImage=""
        onImageSelect={() => {}}
        onRemoveImage={() => {}}
      />
    </div>
  );
};
