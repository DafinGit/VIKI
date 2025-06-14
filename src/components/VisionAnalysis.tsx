
import React, { useState } from 'react';
import { VisionHeader } from './VisionHeader';
import { QuickPrompts } from './QuickPrompts';
import { CustomPrompt } from './CustomPrompt';
import { AnalysisResult } from './AnalysisResult';
import { ImageUpload } from './ImageUpload';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Eye } from 'lucide-react';

interface VisionAnalysisProps {
  apiKey: string;
}

export const VisionAnalysis: React.FC<VisionAnalysisProps> = ({ apiKey }) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelMode, setModelMode] = useState<'normal' | 'medical'>('normal');

  const getModelsForMode = (mode: 'normal' | 'medical') => {
    if (mode === 'medical') {
      return [
        'google/gemma-3-4b-it:free',
        'google/gemini-2.0-flash-exp:free',
        'openai/gpt-4o'
      ];
    } else {
      return [
        'google/gemini-2.0-flash-exp:free',
        'openai/gpt-4o',
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-vision'
      ];
    }
  };

  const handleImageSelect = (file: File, dataUrl: string) => {
    console.log('=== IMAGE SELECTION DEBUG ===');
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    // Create a test image to verify the data URL
    const testImg = new Image();
    testImg.onload = () => {
      console.log('✅ Image loaded successfully in browser:', {
        width: testImg.width,
        height: testImg.height,
        naturalWidth: testImg.naturalWidth,
        naturalHeight: testImg.naturalHeight
      });
    };
    testImg.onerror = (error) => {
      console.error('❌ Failed to load image in browser:', error);
    };
    testImg.src = dataUrl;
    
    console.log('Data URL info:', {
      length: dataUrl.length,
      prefix: dataUrl.substring(0, 50),
      hasBase64: dataUrl.includes('base64'),
      mimeType: dataUrl.split(',')[0]
    });
    
    setImageFile(file);
    setSelectedImage(dataUrl);
    setAnalysis('');
    
    console.log('Image state updated successfully');
  };

  const handleRemoveImage = () => {
    setSelectedImage('');
    setImageFile(null);
    setAnalysis('');
  };

  const analyzeImage = async (promptText: string) => {
    if (!selectedImage || !imageFile) {
      console.error('❌ No image selected for analysis');
      setAnalysis('Error: No image selected. Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setAnalysis('');

    try {
      console.log('=== STARTING VISION ANALYSIS ===');
      console.log('Prompt:', promptText);
      console.log('Model mode:', modelMode);
      console.log('Image file info:', {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size
      });
      
      // Extract and validate base64
      const parts = selectedImage.split(',');
      if (parts.length !== 2) {
        throw new Error('Invalid data URL format - missing comma separator');
      }
      
      const [header, base64Data] = parts;
      const mimeType = header.match(/data:([^;]+)/)?.[1] || imageFile.type;
      
      console.log('Base64 extraction:', {
        headerLength: header.length,
        base64Length: base64Data.length,
        detectedMimeType: mimeType,
        base64Preview: base64Data.substring(0, 100)
      });
      
      // Validate base64 format
      try {
        const decoded = atob(base64Data.substring(0, 100));
        console.log('✅ Base64 validation passed');
      } catch (e) {
        console.error('❌ Base64 validation failed:', e);
        throw new Error(`Invalid base64 format: ${e.message}`);
      }

      // Get models based on selected mode
      const models = getModelsForMode(modelMode);
      
      for (const modelName of models) {
        console.log(`🧪 Trying model: ${modelName} (${modelMode} mode)`);
        
        const contextPrompt = modelMode === 'medical' 
          ? `You are a medical AI assistant analyzing a medical image. Focus on medical details, conditions, anatomy, and clinical observations. ${promptText}`
          : `IMPORTANT: You are analyzing an image. Please describe EXACTLY what you see in this specific image. ${promptText}`;
        
        const requestBody = {
          model: modelName,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: contextPrompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`
                  }
                }
              ]
            }
          ],
          temperature: modelMode === 'medical' ? 0.1 : 0.1,
          max_tokens: 1500,
        };

        console.log(`Request for ${modelName}:`, {
          messageCount: requestBody.messages.length,
          contentItems: requestBody.messages[0].content.length,
          imageUrlLength: requestBody.messages[0].content[1].image_url.url.length,
          temperature: requestBody.temperature
        });

        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'Vision Analysis'
            },
            body: JSON.stringify(requestBody),
          });

          console.log(`Response status for ${modelName}:`, response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ ${modelName} failed:`, {
              status: response.status,
              error: errorText
            });
            continue; // Try next model
          }

          const data = await response.json();
          console.log(`✅ ${modelName} response:`, {
            model: data.model,
            usage: data.usage,
            contentLength: data.choices?.[0]?.message?.content?.length
          });
          
          if (data.choices?.[0]?.message?.content) {
            const result = data.choices[0].message.content;
            console.log(`📝 Response preview from ${modelName}:`, result.substring(0, 200));
            
            setAnalysis(`**Model Used:** ${modelName} (${modelMode} mode)\n\n**Analysis:**\n${result}`);
            return; // Success, exit function
          }
        } catch (modelError) {
          console.error(`❌ Error with ${modelName}:`, modelError);
          continue; // Try next model
        }
      }
      
      // If all models fail
      throw new Error('All vision models failed to analyze the image');
      
    } catch (error) {
      console.error('=== VISION ANALYSIS ERROR ===');
      console.error('Error details:', error);
      setAnalysis(`❌ **Vision Analysis Failed**\n\nError: ${error.message}\n\n**Debugging Steps:**\n1. Check if your OpenRouter API key has vision model access\n2. Try a different image format (JPG/PNG)\n3. Ensure image size is under 10MB\n4. Check console logs for detailed error information\n\n**Technical Details:**\n- Image file: ${imageFile?.name} (${imageFile?.type})\n- Image size: ${Math.round((imageFile?.size || 0) / 1024)}KB\n- Data URL length: ${selectedImage.length}`);
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
          <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
            <h3 className="text-lg font-semibold text-white mb-3">Analysis Mode</h3>
            <div className="flex gap-3">
              <Button
                variant={modelMode === 'normal' ? 'default' : 'outline'}
                onClick={() => setModelMode('normal')}
                className={modelMode === 'normal' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                Normal Vision
              </Button>
              <Button
                variant={modelMode === 'medical' ? 'default' : 'outline'}
                onClick={() => setModelMode('medical')}
                className={modelMode === 'medical' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Medical Analysis
              </Button>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              {modelMode === 'medical' 
                ? 'Uses Gemma 3 4B and Gemini 2.0 Flash for medical image analysis'
                : 'Uses Gemini 2.0 Flash and other vision models for general analysis'
              }
            </p>
          </Card>

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
