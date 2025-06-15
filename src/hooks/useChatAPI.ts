
import { useState } from 'react';
import { Message } from './useChatMessages';

interface ChatAPIConfig {
  apiKey: string;
  googleApiKey: string;
  currentModel: string;
  modelProvider: 'deepseek' | 'gemini';
  temperature: number;
  maxTokens: number;
}

export const useChatAPI = (config: ChatAPIConfig) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    messageContent: string, 
    messages: Message[],
    onSuccess: (message: Message) => void,
    onError: (message: Message) => void,
    generateMessageId: () => string
  ) => {
    setIsLoading(true);

    try {
      console.log('=== SENDING CHAT MESSAGE ===');
      console.log('Provider:', config.modelProvider);
      console.log('Model:', config.currentModel);
      console.log('Message:', messageContent);

      let response;

      if (config.modelProvider === 'gemini') {
        // Try Google Direct API first if key is available, otherwise use OpenRouter
        if (config.googleApiKey) {
          console.log('🔄 Using Google Direct API');
          try {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${config.googleApiKey}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  ...messages.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                  })),
                  {
                    role: 'user',
                    parts: [{ text: messageContent }]
                  }
                ],
                generationConfig: {
                  temperature: config.temperature,
                  maxOutputTokens: config.maxTokens,
                }
              }),
            });
            
            if (!response.ok) {
              console.log('❌ Google Direct API failed, falling back to OpenRouter');
              throw new Error('Google API failed');
            }
          } catch (error) {
            console.log('🔄 Falling back to OpenRouter for Gemini');
            response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Neural Interface Chat'
              },
              body: JSON.stringify({
                model: config.currentModel,
                messages: [
                  ...messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                  })),
                  {
                    role: 'user',
                    content: messageContent
                  }
                ],
                temperature: config.temperature,
                max_tokens: config.maxTokens,
              }),
            });
          }
        } else {
          console.log('🔄 Using OpenRouter for Gemini (no Google key provided)');
          // Use OpenRouter for Gemini
          response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Neural Interface Chat'
            },
            body: JSON.stringify({
              model: config.currentModel,
              messages: [
                ...messages.map(msg => ({
                  role: msg.role,
                  content: msg.content
                })),
                {
                  role: 'user',
                  content: messageContent
                }
              ],
              temperature: config.temperature,
              max_tokens: config.maxTokens,
            }),
          });
        }
      } else {
        console.log('🔄 Using OpenRouter for DeepSeek');
        // Use OpenRouter API for DeepSeek
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Neural Interface Chat'
          },
          body: JSON.stringify({
            model: config.currentModel,
            messages: [
              ...messages.map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              {
                role: 'user',
                content: messageContent
              }
            ],
            temperature: config.temperature,
            max_tokens: config.maxTokens,
          }),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Chat response received');

      let assistantMessage: Message;

      // Check if this is a Google Direct API response or OpenRouter response
      if (data.candidates && config.modelProvider === 'gemini' && config.googleApiKey) {
        // Google Direct API response format
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          assistantMessage = {
            role: 'assistant',
            content: data.candidates[0].content.parts[0].text,
            timestamp: new Date(),
            id: generateMessageId()
          };
        } else {
          throw new Error('Invalid response format from Google API');
        }
      } else {
        // OpenRouter response format (for both DeepSeek and Gemini)
        if (data.choices?.[0]?.message?.content) {
          assistantMessage = {
            role: 'assistant',
            content: data.choices[0].message.content,
            timestamp: new Date(),
            thinking: data.choices[0].message.reasoning || undefined,
            id: generateMessageId()
          };
        } else {
          throw new Error('Invalid response format from OpenRouter API');
        }
      }

      onSuccess(assistantMessage);
    } catch (error) {
      console.error('❌ Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ **Neural Interface Error**\n\nError: ${error.message}\n\nPlease check your API keys and try again.`,
        timestamp: new Date(),
        id: generateMessageId()
      };
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendMessage
  };
};
