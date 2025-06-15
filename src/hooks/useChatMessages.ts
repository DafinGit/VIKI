
import { useState, useRef, useEffect } from 'react';
import { useSpeechSynthesis } from './useSpeechSynthesis';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thinking?: string;
  id: string;
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastSpokenMessageId, setLastSpokenMessageId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speech = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-speak assistant responses with duplicate prevention
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.content && 
        lastMessage.id !== lastSpokenMessageId) {
      
      // Stop any current speech first
      speech.stop();
      
      // Clean the content for speech
      const cleanContent = lastMessage.content
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove code markdown
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/❌|✅|🧪|📝|⚡|🔧|💡/g, '') // Remove emojis
        .replace(/\n+/g, '. ') // Replace line breaks with periods
        .trim();
      
      if (cleanContent && cleanContent.length > 0) {
        setLastSpokenMessageId(lastMessage.id);
        setTimeout(() => {
          speech.speak(cleanContent);
        }, 500);
      }
    }
  }, [messages, speech, lastSpokenMessageId]);

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addMessage = (message: Omit<Message, 'id'>) => {
    const messageWithId = {
      ...message,
      id: generateMessageId()
    };
    setMessages(prev => [...prev, messageWithId]);
    
    // Stop any current speech when adding a user message
    if (message.role === 'user') {
      speech.stop();
    }
    
    return messageWithId;
  };

  const clearMessages = () => {
    setMessages([]);
    setLastSpokenMessageId('');
  };

  return {
    messages,
    messagesEndRef,
    addMessage,
    clearMessages,
    generateMessageId
  };
};
