
import React, { useState, useRef, useEffect } from 'react';
import { ChatControls } from './ChatControls';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

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
      <ChatControls 
        showThinking={showThinking}
        onToggleThinking={() => setShowThinking(!showThinking)}
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
        onSendMessage={sendMessage}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
        onRemoveImage={removeImage}
      />
    </div>
  );
};
