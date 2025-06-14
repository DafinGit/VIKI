
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Award, FileCode, Activity, Cpu, Terminal, Binary } from 'lucide-react';

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
      setAnalysis('❌ CODE ANALYSIS PROTOCOL FAILURE: Neural networks unable to process code structure. Please reinitialize analysis sequence.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Code className="w-8 h-8 text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 font-mono">
                CODE ANALYSIS CORE
              </h2>
              <p className="text-purple-300 font-mono text-sm">Programming Intelligence Processor</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/40 font-mono">
            <Award className="w-4 h-4 mr-1" />
            73.3% LiveCodeBench
          </Badge>
        </div>
        <div className="p-4 bg-gradient-to-r from-purple-900/20 to-violet-900/20 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300 font-mono text-sm">
            NEURAL STATUS: Analyze code complexity, debug issues, or generate high-quality code with DeepSeek-R1's advanced programming expertise and algorithmic intelligence.
          </p>
        </div>
      </Card>

      {/* Mode Selection */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Terminal className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 font-mono">
            PROCESSING MODE SELECTION
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'analyze', label: 'ANALYZE CODE', desc: 'Complexity & optimization review', icon: Binary },
            { id: 'generate', label: 'GENERATE CODE', desc: 'Create from requirements', icon: Code },
            { id: 'debug', label: 'DEBUG ISSUES', desc: 'Error detection & fixes', icon: Zap }
          ].map((option) => {
            const IconComponent = option.icon;
            return (
              <Button
                key={option.id}
                variant={mode === option.id ? "default" : "outline"}
                onClick={() => setMode(option.id as any)}
                className={`h-auto p-4 transition-all duration-300 ${
                  mode === option.id 
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-purple-400 shadow-lg shadow-purple-500/25' 
                    : 'bg-black/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/10 hover:border-purple-400'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <IconComponent className="w-6 h-6" />
                  <span className="font-mono font-semibold text-sm">{option.label}</span>
                  <span className="text-xs opacity-80 font-mono">{option.desc}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Sample Codes */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/5">
        <div className="flex items-center gap-3 mb-4">
          <FileCode className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 font-mono">
            CODE SAMPLE PROTOCOLS
          </h3>
        </div>
        <div className="space-y-3">
          {Object.entries(sampleCodes).map(([lang, sampleCode]) => (
            <Button
              key={lang}
              variant="outline"
              onClick={() => setCode(sampleCode)}
              className="w-full text-left h-auto p-4 bg-black/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/10 hover:border-purple-400 justify-start font-mono transition-all duration-300"
              disabled={isLoading}
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold capitalize mb-1 text-purple-200">{lang.toUpperCase()} PROTOCOL</div>
                  <div className="text-xs text-gray-400 font-mono">
                    {sampleCode.split('\n')[0]}...
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Code Input */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 font-mono">
              CODE INPUT INTERFACE
            </h3>
          </div>
          <div>
            <label className="block text-purple-300 font-mono font-semibold mb-3 text-sm uppercase tracking-wide">
              {mode === 'generate' ? 'Code Generation Parameters' : 'Code Analysis Input'}
            </label>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={
                  mode === 'generate' 
                    ? "Initialize code generation protocol... (e.g., Create a binary search function in Python)"
                    : "Input code for neural analysis..."
                }
                className="w-full h-48 px-4 py-3 bg-gradient-to-r from-gray-900/60 to-black/60 border border-purple-500/40 rounded-lg text-purple-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none font-mono text-sm leading-relaxed transition-all duration-300"
              />
              <div className="absolute bottom-2 right-2">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>
          <Button
            onClick={processCode}
            disabled={!code.trim() || isLoading}
            className={`w-full h-12 font-mono font-semibold text-base transition-all duration-300 ${
              isLoading 
                ? 'bg-gradient-to-r from-yellow-500/50 to-orange-500/50 text-yellow-100' 
                : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 animate-pulse" />
                <span>EXECUTING CODE ANALYSIS...</span>
                <div className="w-4 h-4 border-2 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5" />
                <span>
                  {mode === 'analyze' ? 'INITIATE CODE ANALYSIS' : mode === 'generate' ? 'GENERATE CODE SEQUENCE' : 'DEBUG CODE PROTOCOL'}
                </span>
                <Terminal className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Analysis Result */}
      {analysis && (
        <Card className="p-6 bg-black/40 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-mono">
              {mode === 'analyze' ? 'CODE ANALYSIS OUTPUT' : mode === 'generate' ? 'GENERATED CODE SEQUENCE' : 'DEBUG RESULTS'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 font-mono font-semibold">PROCESSING COMPLETE</span>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
            </div>

            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 p-5 rounded-lg border border-gray-700/50 shadow-inner">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-purple-100 text-sm leading-relaxed font-mono bg-transparent p-0 m-0 border-none overflow-x-auto">
                  {analysis}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 font-mono pt-2 border-t border-gray-700/30">
              <span>VIKI CODE ANALYSIS CORE</span>
              <span>{new Date().toLocaleTimeString()} GMT</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
