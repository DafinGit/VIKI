
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Brain, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: Date;
  image?: string;
}

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThinking, setShowThinking] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelectedImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentImage = selectedImage;
    setSelectedImage('');
    setIsLoading(true);

    try {
      const messageContent = currentImage ? [
        {
          type: 'text',
          text: input
        },
        {
          type: 'image_url',
          image_url: {
            url: currentImage
          }
        }
      ] : input;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Playground'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: '该助手为DeepSeek-R1，由深度求索公司创造。\n今天是' + new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long' 
              }) + '。'
            },
            ...messages.map(msg => ({ 
              role: msg.role, 
              content: msg.image ? [
                { type: 'text', text: msg.content },
                { type: 'image_url', image_url: { url: msg.image } }
              ] : msg.content 
            })),
            { role: 'user', content: messageContent }
          ],
          temperature: 0.6,
          top_p: 0.95,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;
      
      // Extract thinking content if present
      const thinkingMatch = assistantResponse.match(/<think>([\s\S]*?)<\/think>/);
      const thinking = thinkingMatch ? thinkingMatch[1] : null;
      const content = assistantResponse.replace(/<think>[\s\S]*?<\/think>/, '').trim();

      const assistantMessage: Message = {
        role: 'assistant',
        content: content || assistantResponse,
        thinking: thinking || undefined,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check your API key and try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">DeepSeek-R1 Chat</span>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              Free Tier
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              Multimodal
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowThinking(!showThinking)}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            {showThinking ? 'Hide' : 'Show'} Thinking Process
          </Button>
        </div>
      </Card>

      {/* Messages */}
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
                  <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-medium">Thinking Process</span>
                    </div>
                    <pre className="text-xs text-yellow-200 whitespace-pre-wrap font-mono">
                      {message.thinking}
                    </pre>
                  </Card>
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
              onClick={removeImage}
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
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask DeepSeek-R1 anything... Try: 'Solve x² + 5x + 6 = 0' or upload an image for analysis"
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
