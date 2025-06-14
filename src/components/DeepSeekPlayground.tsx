
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Calculator, MessageSquare, Sparkles, Zap, Eye } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { MathSolver } from './MathSolver';
import { CodeAnalyzer } from './CodeAnalyzer';
import { ReasoningTasks } from './ReasoningTasks';
import { VisionAnalysis } from './VisionAnalysis';

export const DeepSeekPlayground = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter-key') || '');

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { id: 'vision', label: 'Vision Analysis', icon: Eye, color: 'from-cyan-500 to-teal-500' },
    { id: 'math', label: 'Math Solver', icon: Calculator, color: 'from-green-500 to-emerald-500' },
    { id: 'code', label: 'Code Analysis', icon: Code, color: 'from-purple-500 to-violet-500' },
    { id: 'reasoning', label: 'Complex Reasoning', icon: Brain, color: 'from-orange-500 to-red-500' },
  ];

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem('openrouter-key', key);
  };

  const renderContent = () => {
    if (!apiKey) {
      return (
        <div className="flex items-center justify-center h-96">
          <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
            <div className="text-center space-y-4">
              <Zap className="w-12 h-12 mx-auto text-yellow-400" />
              <h3 className="text-xl font-bold text-white">API Key Required</h3>
              <p className="text-gray-300">Enter your OpenRouter API key to start using DeepSeek-R1</p>
              <input
                type="password"
                placeholder="Enter OpenRouter API Key"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-400">
                Get your free API key at{' '}
                <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  openrouter.ai
                </a>
              </p>
            </div>
          </Card>
        </div>
      );
    }

    switch (activeTab) {
      case 'chat':
        return <ChatInterface apiKey={apiKey} />;
      case 'vision':
        return <VisionAnalysis apiKey={apiKey} />;
      case 'math':
        return <MathSolver apiKey={apiKey} />;
      case 'code':
        return <CodeAnalyzer apiKey={apiKey} />;
      case 'reasoning':
        return <ReasoningTasks apiKey={apiKey} />;
      default:
        return <ChatInterface apiKey={apiKey} />;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-yellow-400/20 rounded-full animate-ping" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DeepSeek-R1 Playground
            </h1>
          </div>
          <p className="text-gray-300 text-lg mb-4">
            Experience the power of DeepSeek-R1-0528 - Advanced AI reasoning with multimodal capabilities
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              🧮 87.5% AIME 2025
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              💻 73.3% LiveCodeBench
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              🧠 23K Token Reasoning
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              👁️ Vision Analysis
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
              ⚡ Enhanced Chain-of-Thought
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={`relative overflow-hidden transition-all duration-300 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.color} text-white border-0 shadow-lg scale-105` 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
