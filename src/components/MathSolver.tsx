
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Zap, Trophy, Target } from 'lucide-react';

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
      setSolution('Sorry, I encountered an error while solving this problem. Please try again.');
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
            <Calculator className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Math Problem Solver</h2>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            <Trophy className="w-4 h-4 mr-1" />
            87.5% AIME 2025
          </Badge>
        </div>
        <p className="text-gray-300">
          Leverage DeepSeek-R1's mathematical reasoning capabilities to solve complex problems step-by-step.
        </p>
      </Card>

      {/* Sample Problems */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Try These Sample Problems
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sampleProblems.map((sample, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => {
                setProblem(sample);
                solveProblem(sample);
              }}
              className="text-left h-auto p-3 bg-white/5 text-white border-white/20 hover:bg-white/10 justify-start"
              disabled={isLoading}
            >
              <div className="text-sm">{sample}</div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Problem Input */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Enter Math Problem</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Enter your math problem here... (e.g., Solve x² + 5x + 6 = 0)"
              className="w-full h-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
          <Button
            onClick={() => solveProblem(problem)}
            disabled={!problem.trim() || isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            {isLoading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Solving...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Solve Problem
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Solution */}
      {solution && (
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Solution
          </h3>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
              {solution}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};
