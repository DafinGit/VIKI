
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Zap, Camera, Lightbulb } from 'lucide-react';
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

  const quickPrompts = [
    "Describe what you see in this image in detail",
    "What objects can you identify in this image?",
    "Analyze the composition and visual elements",
    "What's the mood or atmosphere of this image?",
    "Extract any text you can see in this image",
    "What mathematical concepts are shown here?",
    "Explain the process or steps shown in this diagram"
  ];

  const handleImageSelect = (file: File, dataUrl: string) => {
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
    if (!selectedImage || !imageFile) return;
    
    setIsLoading(true);
    setAnalysis('');

    try {
      // Convert image to base64
      const base64Image = selectedImage.split(',')[1];
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Vision Analysis'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的图像分析助手。请仔细观察图像并提供详细、准确的分析。'
            },
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
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices[0].message.content;
      
      // Remove thinking tags for cleaner display
      const cleanResult = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      setAnalysis(cleanResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setAnalysis('Sorry, I encountered an error while analyzing the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Vision Analysis</h2>
          </div>
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
            <Camera className="w-4 h-4 mr-1" />
            Multimodal AI
          </Badge>
        </div>
        <p className="text-gray-300">
          Upload images and let DeepSeek-R1 analyze them with advanced computer vision capabilities.
        </p>
      </Card>

      {/* Image Upload */}
      <ImageUpload
        onImageSelect={handleImageSelect}
        selectedImage={selectedImage}
        onRemoveImage={handleRemoveImage}
      />

      {/* Quick Prompts */}
      {selectedImage && (
        <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Quick Analysis Prompts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => {
                  setPrompt(quickPrompt);
                  analyzeImage(quickPrompt);
                }}
                className="text-left h-auto p-3 bg-white/5 text-white border-white/20 hover:bg-white/10 justify-start"
                disabled={isLoading}
              >
                <div className="text-sm">{quickPrompt}</div>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Custom Prompt */}
      {selectedImage && (
        <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Custom Analysis Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything about the image... (e.g., What mathematical formula is shown? Describe the scene in detail)"
                className="w-full h-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>
            <Button
              onClick={() => analyzeImage(prompt)}
              disabled={!prompt.trim() || isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Analyze Image
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Analysis Result */}
      {analysis && (
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Vision Analysis
          </h3>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              {analysis}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};
