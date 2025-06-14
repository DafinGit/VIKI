
import React, { useState } from 'react';
import { VisionHeader } from './VisionHeader';
import { QuickPrompts } from './QuickPrompts';
import { CustomPrompt } from './CustomPrompt';
import { AnalysisResult } from './AnalysisResult';
import { ImageUpload } from './ImageUpload';

interface VisionAnalysisProps {
  apiKey: string;
}

export const VisionAnalysis: React.FC<VisionAnalysisProps> = ({ apiKey }) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file: File, dataUrl: string) => {
    console.log('=== IMAGE SELECTION DEBUG ===');
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    console.log('Data URL prefix:', dataUrl.substring(0, 100));
    console.log('Data URL total length:', dataUrl.length);
    
    // Validate the image format
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return;
    }

    // Check if data URL is properly formatted
    if (!dataUrl.startsWith('data:')) {
      console.error('Invalid data URL format');
      return;
    }

    setImageFile(file);
    setSelectedImage(dataUrl);
    setAnalysis('');
    
    console.log('Image successfully loaded and set');
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
    setImageFile(null);
    setAnalysis('');
  };

  const analyzeImage = async (promptText: string) => {
    if (!selectedImage || !imageFile) {
      console.error('No image selected for analysis');
      return;
    }
    
    setIsLoading(true);
    setAnalysis('');

    try {
      console.log('=== STARTING IMAGE ANALYSIS ===');
      console.log('Prompt:', promptText);
      console.log('Image file:', imageFile.name, imageFile.type);
      
      // Extract base64 from data URL
      let base64Image = selectedImage;
      if (base64Image.includes(',')) {
        base64Image = base64Image.split(',')[1];
      }
      
      console.log('Base64 length after extraction:', base64Image.length);
      console.log('Base64 first 50 chars:', base64Image.substring(0, 50));
      
      // Validate base64 format
      try {
        atob(base64Image.substring(0, 100)); // Test decode small portion
        console.log('Base64 format validation: PASSED');
      } catch (e) {
        console.error('Base64 format validation: FAILED', e);
        throw new Error('Invalid base64 format');
      }

      const requestBody = {
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageFile.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      };

      console.log('Request body structure:', {
        model: requestBody.model,
        messageCount: requestBody.messages.length,
        contentTypes: requestBody.messages[0].content.map(c => c.type),
        imageUrlPrefix: requestBody.messages[0].content[1].image_url.url.substring(0, 50),
        temperature: requestBody.temperature,
        maxTokens: requestBody.max_tokens
      });

      console.log('Sending request to OpenRouter API...');
      const startTime = Date.now();
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Vision Analysis'
        },
        body: JSON.stringify(requestBody),
      });

      const responseTime = Date.now() - startTime;
      console.log(`API response received in ${responseTime}ms with status:`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('=== API RESPONSE ANALYSIS ===');
      console.log('Full response structure:', {
        id: data.id,
        model: data.model,
        object: data.object,
        created: data.created,
        provider: data.provider,
        choicesCount: data.choices?.length,
        usage: data.usage
      });
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid API response format:', data);
        throw new Error('Invalid API response format');
      }
      
      const result = data.choices[0].message.content;
      console.log('Response content length:', result.length);
      console.log('Response preview:', result.substring(0, 200));
      
      // Check if response mentions the actual image content
      const responseWords = result.toLowerCase();
      const gameKeywords = ['game', 'counter-strike', 'tactical', 'weapon', 'soldier', 'combat', 'military'];
      const forestKeywords = ['forest', 'tree', 'stream', 'moss', 'river', 'tropical'];
      
      const gameMatches = gameKeywords.filter(word => responseWords.includes(word)).length;
      const forestMatches = forestKeywords.filter(word => responseWords.includes(word)).length;
      
      console.log('Content analysis:', {
        gameKeywords: gameMatches,
        forestKeywords: forestMatches,
        likelyMismatch: forestMatches > gameMatches
      });
      
      // Remove thinking tags for cleaner display
      const cleanResult = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      setAnalysis(cleanResult);
      
      console.log('=== ANALYSIS COMPLETE ===');
      
    } catch (error) {
      console.error('=== ERROR DURING ANALYSIS ===');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      setAnalysis(`Error analyzing image: ${error.message}\n\nThis appears to be an issue with the vision API not receiving the correct image data. Please try with a different image or check the console for debugging information.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPromptSelect = (promptText: string) => {
    setPrompt(promptText);
    analyzeImage(promptText);
  };

  const handleCustomAnalyze = () => {
    analyzeImage(prompt);
  };

  return (
    <div className="space-y-6">
      <VisionHeader selectedImage={selectedImage} imageFile={imageFile} />
      
      <ImageUpload
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage}
        onRemoveImage={handleRemoveImage}
      />

      {selectedImage && (
        <>
          <QuickPrompts 
            onPromptSelect={handleQuickPromptSelect}
            isLoading={isLoading}
          />
          
          <CustomPrompt
            prompt={prompt}
            setPrompt={setPrompt}
            onAnalyze={handleCustomAnalyze}
            isLoading={isLoading}
          />
        </>
      )}

      <AnalysisResult analysis={analysis} />
    </div>
  );
};
