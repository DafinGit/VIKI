
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Award, FileCode } from 'lucide-react';

interface CodeAnalyzerProps {
  apiKey: string;
}

export const CodeAnalyzer: React.FC<CodeAnalyzerProps> = ({ apiKey }) => {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'analyze' | 'generate' | 'debug'>('analyze');

  const sampleCodes = {
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# This has performance issues - can you optimize it?`,
    javascript: `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const right = arr.filter(x => x > pivot);
    const middle = arr.filter(x => x === pivot);
    
    return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
    sql: `SELECT 
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
GROUP BY u.id
HAVING total_spent > 1000
ORDER BY total_spent DESC;`
  };

  const prompts = {
    analyze: "请分析这段代码的时间复杂度、空间复杂度、潜在问题和改进建议：",
    generate: "请根据以下需求生成高质量的代码，并添加详细注释：",
    debug: "请找出这段代码中的bug并提供修复方案："
  };

  const processCode = async () => {
    setIsLoading(true);
    setAnalysis('');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DeepSeek-R1 Code Analyzer'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的代码分析和生成助手。请提供详细的代码分析、优化建议和高质量的代码实现。'
            },
            {
              role: 'user',
              content: `${prompts[mode]}\n\n\`\`\`\n${code}\n\`\`\``
            }
          ],
          temperature: 0.2,
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
      console.error('Error processing code:', error);
      setAnalysis('Sorry, I encountered an error while processing the code. Please try again.');
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
            <Code className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Code Analysis & Generation</h2>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Award className="w-4 h-4 mr-1" />
            73.3% LiveCodeBench
          </Badge>
        </div>
        <p className="text-gray-300">
          Analyze code complexity, debug issues, or generate high-quality code with DeepSeek-R1's programming expertise.
        </p>
      </Card>

      {/* Mode Selection */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'analyze', label: 'Analyze Code', desc: 'Review complexity & improvements' },
            { id: 'generate', label: 'Generate Code', desc: 'Create code from requirements' },
            { id: 'debug', label: 'Debug Issues', desc: 'Find and fix bugs' }
          ].map((option) => (
            <Button
              key={option.id}
              variant={mode === option.id ? "default" : "outline"}
              onClick={() => setMode(option.id as any)}
              className={`flex-1 h-auto p-3 ${
                mode === option.id 
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-0' 
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-80">{option.desc}</div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Sample Codes */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-blue-400" />
          Sample Code Examples
        </h3>
        <div className="space-y-2">
          {Object.entries(sampleCodes).map(([lang, sampleCode]) => (
            <Button
              key={lang}
              variant="outline"
              onClick={() => setCode(sampleCode)}
              className="w-full text-left h-auto p-3 bg-white/5 text-white border-white/20 hover:bg-white/10 justify-start"
              disabled={isLoading}
            >
              <div>
                <div className="font-medium capitalize mb-1">{lang} Example</div>
                <div className="text-xs text-gray-400 font-mono">
                  {sampleCode.split('\n')[0]}...
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Code Input */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              {mode === 'generate' ? 'Code Requirements' : 'Code to Analyze'}
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={
                mode === 'generate' 
                  ? "Describe what you want the code to do... (e.g., Create a binary search function in Python)"
                  : "Paste your code here..."
              }
              className="w-full h-48 px-4 py-2 bg-gray-900/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
            />
          </div>
          <Button
            onClick={processCode}
            disabled={!code.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white"
          >
            {isLoading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                {mode === 'analyze' ? 'Analyze Code' : mode === 'generate' ? 'Generate Code' : 'Debug Code'}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Analysis Result */}
      {analysis && (
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            {mode === 'analyze' ? 'Code Analysis' : mode === 'generate' ? 'Generated Code' : 'Debug Results'}
          </h3>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-gray-200 font-mono text-sm bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 overflow-x-auto">
              {analysis}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};
