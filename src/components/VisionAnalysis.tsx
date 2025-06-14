
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
    console.log('Selected image file:', file.name, file.type, file.size);
    console.log('Data URL length:', dataUrl.length);
    setImageFile(file);
    setSelectedImage(dataUrl);
    setAnalysis('');
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
    setImageFile(null);
    setAnalysis('');
  };

  const analyzeImage = async (promptText: string) => {
    if (!selectedImage || !imageFile) {
      console.error('No image selected');
      return;
    }
    
    setIsLoading(true);
    setAnalysis('');

    try {
      // Ensure we have a proper base64 string
      let base64Image = selectedImage;
      if (base64Image.includes(',')) {
        base64Image = base64Image.split(',')[1];
      }
      
      console.log('Analyzing image with prompt:', promptText);
      console.log('Image type:', imageFile.type);
      console.log('Base64 length:', base64Image.length);
      
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

      console.log('Sending request to OpenRouter API...');
      
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

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }
      
      const result = data.choices[0].message.content;
      
      // Remove thinking tags for cleaner display
      const cleanResult = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      setAnalysis(cleanResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysis(`Sorry, I encountered an error while analyzing the image: ${error.message}. Please try again.`);
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
