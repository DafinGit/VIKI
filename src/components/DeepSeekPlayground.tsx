
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Code, Calculator, MessageSquare, Sparkles, Zap, Eye, Cpu, Activity } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { MathSolver } from './MathSolver';
import { CodeAnalyzer } from './CodeAnalyzer';
import { ReasoningTasks } from './ReasoningTasks';
import { VisionAnalysis } from './VisionAnalysis';

export const DeepSeekPlayground = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter-key') || '');

  const tabs = [
    { id: 'chat', label: 'Neural Interface', icon: MessageSquare, color: 'from-blue-500 to-cyan-500' },
    { id: 'vision', label: 'VIKI Vision', icon: Eye, color: 'from-cyan-500 to-teal-500' },
    { id: 'math', label: 'Calculation Matrix', icon: Calculator, color: 'from-green-500 to-emerald-500' },
    { id: 'code', label: 'Code Analysis Core', icon: Code, color: 'from-purple-500 to-violet-500' },
    { id: 'reasoning', label: 'Logic Processor', icon: Brain, color: 'from-orange-500 to-red-500' },
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
          <Card className="p-8 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-6 w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                AUTHORIZATION REQUIRED
              </h3>
              <p className="text-cyan-300 font-mono">Initialize neural network access credentials</p>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter OpenRouter API Access Key"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-900/60 to-black/60 border border-cyan-500/40 rounded-lg text-cyan-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 font-mono"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300 font-mono">
                    ACQUIRE AUTHORIZATION TOKEN AT:{' '}
                    <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
                      OPENROUTER.AI
                    </a>
                  </p>
                </div>
              </div>
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
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                VIKI NEURAL SYSTEM
              </h1>
              <p className="text-cyan-300 text-lg font-mono mt-2">
                Virtual Interactive Kinetic Intelligence • DeepSeek-R1 Core
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-lg mb-6 font-mono">
            Advanced AI reasoning platform with multimodal cognitive capabilities
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono">
              <Brain className="w-3 h-3 mr-1" />
              87.5% AIME 2025
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/40 font-mono">
              <Code className="w-3 h-3 mr-1" />
              73.3% LiveCodeBench
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/40 font-mono">
              <Zap className="w-3 h-3 mr-1" />
              23K Token Reasoning
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-mono">
              <Eye className="w-3 h-3 mr-1" />
              Vision Analysis
            </Badge>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/40 font-mono">
              <Activity className="w-3 h-3 mr-1" />
              Enhanced CoT
            </Badge>
          </div>
        </div>

        {/* Navigation Interface */}
        <Card className="p-6 mb-8 bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-lg shadow-cyan-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
              MODULE SELECTION INTERFACE
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative overflow-hidden transition-all duration-300 h-auto p-4 ${
                    activeTab === tab.id 
                      ? `bg-gradient-to-r ${tab.color} text-white border-0 shadow-lg shadow-cyan-500/25 scale-105` 
                      : 'bg-black/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/10 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-mono font-semibold">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  )}
                </Button>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-600/30">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-mono text-sm font-semibold">
                ACTIVE MODULE: {tabs.find(t => t.id === activeTab)?.label.toUpperCase()}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
              <span className="text-gray-400 font-mono text-xs">STATUS: ONLINE</span>
            </div>
          </div>
        </Card>

        {/* Content */}
        <div className="relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
