
import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatControls } from './ChatControls';
import { SpeechControls } from './SpeechControls';
import { CameraFeed } from './CameraFeed';
import { NeuralInterfaceHeader } from './NeuralInterfaceHeader';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatAPI } from '@/hooks/useChatAPI';

interface ChatInterfaceProps {
  apiKey: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ apiKey }) => {
  const [currentModel, setCurrentModel] = useState('deepseek/deepseek-r1');
  const [temperature, setTemperature] = useState(0.1);
  const [maxTokens, setMaxTokens] = useState(8000);
  const [input, setInput] = useState('');
  const [showThinking, setShowThinking] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const { messages, messagesEndRef, addMessage, clearMessages, generateMessageId } = useChatMessages();
  
  const { isLoading, sendMessage } = useChatAPI({
    apiKey,
    currentModel,
    temperature,
    maxTokens
  });

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

  const toggleVideo = () => {
    setIsVideoEnabled(prev => !prev);
  };

  return (
    <div className="space-y-6">
      <NeuralInterfaceHeader />

      <SpeechControls 
        onVoiceInput={handleVoiceInput}
        isVideoEnabled={isVideoEnabled}
        onToggleVideo={toggleVideo}
      />

      {isVideoEnabled && (
        <CameraFeed 
          isEnabled={isVideoEnabled}
          onToggle={toggleVideo}
        />
      )}

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
