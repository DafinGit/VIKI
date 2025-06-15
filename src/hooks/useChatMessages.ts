
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
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-speak assistant responses with duplicate prevention and debouncing
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.content && 
        lastMessage.id !== lastSpokenMessageId) {
      
      // Clear any existing timeout
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      
      // Stop any current speech first
      speech.stop();
      
      // Set the message as spoken immediately to prevent duplicates
      setLastSpokenMessageId(lastMessage.id);
      
      // Clean the content for speech - remove translations and English text
      let cleanContent = lastMessage.content
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove code markdown
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/❌|✅|🧪|📝|⚡|🔧|💡|😊|😄|🌟|🎉/g, '') // Remove emojis
        .replace(/\n+/g, '. ') // Replace line breaks with periods
        .trim();

      // Remove translation parts - anything in parentheses that starts with "Translated:"
      cleanContent = cleanContent.replace(/\s*\*?\(Translated:.*?\)\*?/g, '');
      
      // Remove any remaining parenthetical translations or explanations
      cleanContent = cleanContent.replace(/\s*\([^)]*Translation[^)]*\)/gi, '');
      cleanContent = cleanContent.replace(/\s*\([^)]*Romana[^)]*\)/gi, '');
      cleanContent = cleanContent.replace(/\s*\([^)]*English[^)]*\)/gi, '');
      
      // Clean up any double spaces or trailing punctuation
      cleanContent = cleanContent.replace(/\s+/g, ' ').trim();
      
      if (cleanContent && cleanContent.length > 0) {
        // Debounce speech to prevent rapid fire
        speechTimeoutRef.current = setTimeout(() => {
          speech.speak(cleanContent);
        }, 800);
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
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    }
    
    return messageWithId;
  };

  const clearMessages = () => {
    setMessages([]);
    setLastSpokenMessageId('');
    speech.stop();
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
  };

  return {
    messages,
    messagesEndRef,
    addMessage,
    clearMessages,
    generateMessageId
  };
};
