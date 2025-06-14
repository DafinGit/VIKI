
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap, Trophy, Target, Activity, Cpu, Brain } from 'lucide-react';

interface MathSolverProps {
  apiKey: string;
}

export const MathSolver: React.FC<MathSolverProps> = ({ apiKey }) => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleProblems = [
    "Find all solutions to x³ - 6x² + 11x - 6 = 0",
    "Prove that √2 is irrational",
    "Find the limit of (sin(x)/x) as x approaches 0",
    "Solve the system: 2x + 3y = 7, 4x - y = 1",
    "Find the area under the curve y = x² from x = 0 to x = 3"
  ];

  const solveProblem = async (problemText: string) => {
    setIsLoading(true);
    setSolution('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Math Solver'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的数学问题解决助手。请提供详细的解题步骤，包括所有必要的数学推理过程。对于复杂问题，请展示完整的思维过程。'
            },
            {
              role: 'user',
              content: `请解决这个数学问题，并提供详细的解题步骤：\n\n${problemText}`
            }
          ],
          temperature: 0.1,
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
      console.error('Error solving problem:', error);
      setSolution('❌ NEURAL CALCULATION ERROR: System unable to process mathematical query. Please reinitialize computation protocol.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-green-500/30 shadow-lg shadow-green-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Calculator className="w-8 h-8 text-green-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-mono">
                CALCULATION MATRIX
              </h2>
              <p className="text-green-300 font-mono text-sm">Mathematical Reasoning Processor</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/40 font-mono">
            <Trophy className="w-4 h-4 mr-1" />
            87.5% AIME 2025
          </Badge>
        </div>
        <div className="p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-300 font-mono text-sm">
            NEURAL STATUS: Leverage DeepSeek-R1's advanced mathematical reasoning capabilities to solve complex computational problems with step-by-step analytical processing.
          </p>
        </div>
      </Card>

      {/* Sample Problems */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-green-500/30 shadow-lg shadow-green-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-mono">
            MATHEMATICAL TRAINING PROTOCOLS
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleProblems.map((sample, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => {
                setProblem(sample);
                solveProblem(sample);
              }}
              className="text-left h-auto p-4 bg-black/20 text-green-300 border-green-500/40 hover:bg-green-500/10 hover:border-green-400 justify-start font-mono transition-all duration-300"
              disabled={isLoading}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="text-sm">{sample}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Problem Input */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-green-500/30 shadow-lg shadow-green-500/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-mono">
              MATHEMATICAL INPUT INTERFACE
            </h3>
          </div>
          <div>
            <label className="block text-green-300 font-mono font-semibold mb-3 text-sm uppercase tracking-wide">
              Neural Computation Query
            </label>
            <div className="relative">
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Initialize mathematical processing protocol... (e.g., Solve x² + 5x + 6 = 0)"
                className="w-full h-32 px-4 py-3 bg-gradient-to-r from-gray-900/60 to-black/60 border border-green-500/40 rounded-lg text-green-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none font-mono text-sm leading-relaxed transition-all duration-300"
              />
              <div className="absolute bottom-2 right-2">
                <Activity className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>
          <Button
            onClick={() => solveProblem(problem)}
            disabled={!problem.trim() || isLoading}
            className={`w-full h-12 font-mono font-semibold text-base transition-all duration-300 ${
              isLoading 
                ? 'bg-gradient-to-r from-yellow-500/50 to-orange-500/50 text-yellow-100' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 animate-pulse" />
                <span>EXECUTING NEURAL CALCULATIONS...</span>
                <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5" />
                <span>INITIATE CALCULATION MATRIX</span>
                <Cpu className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Solution */}
      {solution && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border border-green-500/30 shadow-lg shadow-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
              COMPUTATIONAL SOLUTION OUTPUT
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-mono font-semibold">CALCULATION COMPLETE</span>
              <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 p-5 rounded-lg border border-gray-700/50 shadow-inner">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-green-100 text-sm leading-relaxed font-mono bg-transparent p-0 m-0 border-none">
                  {solution}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-mono pt-2 border-t border-gray-700/30">
              <span>VIKI CALCULATION MATRIX SYSTEM</span>
              <span>{new Date().toLocaleTimeString()} GMT</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
