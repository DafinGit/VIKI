
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Lightbulb, Target, Activity, Cpu, Puzzle, Cog } from 'lucide-react';

interface ReasoningTasksProps {
  apiKey: string;
}

export const ReasoningTasks: React.FC<ReasoningTasksProps> = ({ apiKey }) => {
  const [task, setTask] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reasoningTypes = [
    {
      id: 'logical',
      name: 'LOGICAL REASONING',
      description: 'Deductive and inductive logic analysis',
      prompt: 'All birds can fly. Penguins are birds. Can penguins fly? Explain the logical reasoning.',
      icon: Brain
    },
    {
      id: 'mathematical',
      name: 'MATHEMATICAL PROOF',
      description: 'Mathematical reasoning and proofs',
      prompt: 'Prove that the sum of two even numbers is always even.',
      icon: Target
    },
    {
      id: 'causal',
      name: 'CAUSAL ANALYSIS',
      description: 'Cause and effect relationships',
      prompt: 'If global temperatures rise by 2°C, what would be the cascading effects on ocean currents, weather patterns, and ecosystems?',
      icon: Lightbulb
    },
    {
      id: 'ethical',
      name: 'ETHICAL DILEMMA',
      description: 'Moral reasoning and ethical analysis',
      prompt: 'A self-driving car must choose between hitting one person or swerving to hit five people. What factors should determine this decision?',
      icon: Puzzle
    },
    {
      id: 'strategic',
      name: 'STRATEGIC PLANNING',
      description: 'Multi-step problem solving',
      prompt: 'Design a strategy to reduce plastic pollution in oceans over the next 10 years, considering economic, technological, and political constraints.',
      icon: Cog
    }
  ];

  const solveTask = async (taskText: string) => {
    setIsLoading(true);
    setSolution('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Reasoning Tasks'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的推理和逻辑分析助手。请提供详细的推理过程，展示每一步的思考逻辑，并给出结论。对于复杂问题，请分解为多个步骤来分析。'
            },
            {
              role: 'user',
              content: `请分析以下推理问题，并提供详细的思考过程：\n\n${taskText}`
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
      setSolution(cleanResult);
    } catch (error) {
      console.error('Error solving reasoning task:', error);
      setSolution('❌ LOGIC PROCESSOR MALFUNCTION: Neural reasoning circuits unable to process query. Please reinitialize cognitive analysis protocol.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-orange-500/30 shadow-lg shadow-orange-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-orange-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 font-mono">
                LOGIC PROCESSOR
              </h2>
              <p className="text-orange-300 font-mono text-sm">Advanced Reasoning Protocol Engine</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/40 font-mono">
            <Lightbulb className="w-4 h-4 mr-1" />
            Enhanced CoT
          </Badge>
        </div>
        <div className="p-4 bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-lg">
          <p className="text-orange-300 font-mono text-sm">
            NEURAL STATUS: Multi-layered cognitive analysis system with enhanced chain-of-thought reasoning. Specialized in complex logical deduction and strategic problem-solving protocols.
          </p>
        </div>
      </Card>

      {/* Reasoning Types */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-orange-500/30 shadow-lg shadow-orange-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 font-mono">
            REASONING PROTOCOL SELECTION
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reasoningTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <Button
                key={type.id}
                variant="outline"
                onClick={() => {
                  setTask(type.prompt);
                  solveTask(type.prompt);
                }}
                className="h-auto p-4 bg-black/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/10 hover:border-orange-400 text-left justify-start font-mono transition-all duration-300"
                disabled={isLoading}
              >
                <div className="flex flex-col items-start gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-orange-400" />
                    <span className="font-semibold text-sm">{type.name}</span>
                  </div>
                  <span className="text-xs opacity-80">{type.description}</span>
                  <div className="w-full h-px bg-gradient-to-r from-orange-400/30 to-transparent mt-1"></div>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Custom Task Input */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-orange-500/30 shadow-lg shadow-orange-500/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 font-mono">
              CUSTOM REASONING INTERFACE
            </h3>
          </div>
          <div>
            <label className="block text-orange-300 font-mono font-semibold mb-3 text-sm uppercase tracking-wide">
              Neural Logic Query Input
            </label>
            <div className="relative">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Initialize cognitive analysis protocol... (e.g., Analyze the logical implications of artificial consciousness in robotic systems)"
                className="w-full h-32 px-4 py-3 bg-gradient-to-r from-gray-900/60 to-black/60 border border-orange-500/40 rounded-lg text-orange-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 resize-none font-mono text-sm leading-relaxed transition-all duration-300"
              />
              <div className="absolute bottom-2 right-2">
                <Activity className="w-4 h-4 text-orange-400" />
              </div>
            </div>
          </div>
          <Button
            onClick={() => solveTask(task)}
            disabled={!task.trim() || isLoading}
            className={`w-full h-12 font-mono font-semibold text-base transition-all duration-300 ${
              isLoading 
                ? 'bg-gradient-to-r from-yellow-500/50 to-orange-500/50 text-yellow-100' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 animate-pulse" />
                <span>EXECUTING COGNITIVE ANALYSIS...</span>
                <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5" />
                <span>INITIATE LOGIC PROCESSOR</span>
                <Target className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Solution */}
      {solution && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border border-orange-500/30 shadow-lg shadow-orange-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
              COGNITIVE ANALYSIS OUTPUT
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-orange-400 font-mono font-semibold">REASONING COMPLETE</span>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-400/50 to-transparent"></div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 p-5 rounded-lg border border-gray-700/50 shadow-inner">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-orange-100 text-sm leading-relaxed font-mono bg-transparent p-0 m-0 border-none">
                  {solution}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-mono pt-2 border-t border-gray-700/30">
              <span>VIKI LOGIC PROCESSOR SYSTEM</span>
              <span>{new Date().toLocaleTimeString()} GMT</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
