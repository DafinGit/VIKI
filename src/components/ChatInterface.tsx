
import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatControls } from './ChatControls';
import { SpeechControls } from './SpeechControls';
import { NeuralInterfaceHeader } from './NeuralInterfaceHeader';
import { ModelSelector } from './ModelSelector';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatAPI } from '@/hooks/useChatAPI';

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const [currentModel, setCurrentModel] = useState('deepseek/deepseek-r1');
  const [modelProvider, setModelProvider] = useState<'deepseek' | 'gemini'>('deepseek');
  const [temperature, setTemperature] = useState(0.1);
  const [maxTokens, setMaxTokens] = useState(8000);
  const [input, setInput] = useState('');
  const [showThinking, setShowThinking] = useState(true);

  const { messages, messagesEndRef, addMessage, clearMessages, generateMessageId } = useChatMessages();
  
  const { isLoading, sendMessage } = useChatAPI({
    apiKey,
    currentModel,
    modelProvider,
    temperature,
    maxTokens
  });

  const handleModelProviderChange = (provider: 'deepseek' | 'gemini') => {
    setModelProvider(provider);
    if (provider === 'gemini') {
      setCurrentModel('google/gemini-flash-1.5');
    } else {
      setCurrentModel('deepseek/deepseek-r1');
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || isLoading) return;

    const userMessage = addMessage({
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    });

    if (!messageText) setInput('');

    await sendMessage(
      messageContent,
      messages,
      (assistantMessage) => addMessage(assistantMessage),
      (errorMessage) => addMessage(errorMessage),
      generateMessageId
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (text: string) => {
    console.log('Voice input received:', text);
    if (text.trim()) {
      handleSendMessage(text.trim());
    }
  };

  const toggleThinking = () => {
    setShowThinking(prev => !prev);
  };

  return (
    <div className="space-y-6">
      <NeuralInterfaceHeader />

      <ModelSelector 
        modelProvider={modelProvider}
        onProviderChange={handleModelProviderChange}
      />

      <SpeechControls 
        onVoiceInput={handleVoiceInput}
      />

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
        onSendMessage={() => handleSendMessage()}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
        selectedImage=""
        onImageSelect={() => {}}
        onRemoveImage={() => {}}
      />
    </div>
  );
};
