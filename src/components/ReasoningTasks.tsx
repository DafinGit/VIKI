import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Lightbulb, Puzzle } from 'lucide-react';

interface ReasoningTasksProps {
  apiKey: string;
}

export const ReasoningTasks: React.FC<ReasoningTasksProps> = ({ apiKey }) => {
  const [task, setTask] = useState('');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleTasks = [
    "If all roses are flowers, and some flowers fade quickly, can we conclude that some roses fade quickly?",
    "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    "You have 12 balls, 11 of which weigh the same. One ball weighs differently. Using a balance scale only 3 times, how do you find the different ball?",
    "In a small town, there's a barber who shaves only those people who do not shave themselves. Who shaves the barber?",
    "If you're running a race and you pass the person in 2nd place, what place are you in now?"
  ];

  const reasoningCategories = [
    { name: "Logic Puzzles", desc: "Test deductive and inductive reasoning" },
    { name: "Mathematical Reasoning", desc: "Complex word problems and proofs" },
    { name: "Paradoxes", desc: "Explore philosophical contradictions" },
    { name: "Pattern Recognition", desc: "Identify sequences and relationships" },
    { name: "Critical Thinking", desc: "Analyze arguments and assumptions" }
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
              content: '你是一个专业的逻辑推理助手。请使用系统性的思维方法来分析复杂的推理问题，展示完整的思考过程，包括所有的假设、推理步骤和结论。'
            },
            {
              role: 'user',
              content: `请分析这个推理任务，提供详细的思考过程和解答：\n\n${taskText}`
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
      
      // Keep thinking process visible for reasoning tasks
      setSolution(result);
    } catch (error) {
      console.error('Error solving reasoning task:', error);
      setSolution('Sorry, I encountered an error while processing this reasoning task. Please try again.');
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
            <Brain className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Complex Reasoning Tasks</h2>
          </div>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
            <Lightbulb className="w-4 h-4 mr-1" />
            23K Token Thinking
          </Badge>
        </div>
        <p className="text-gray-300">
          Challenge DeepSeek-R1's advanced reasoning with complex logic puzzles, paradoxes, and multi-step problems.
        </p>
      </Card>

      {/* Reasoning Categories */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-blue-400" />
          Reasoning Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {reasoningCategories.map((category, index) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="font-medium text-white mb-1">{category.name}</div>
              <div className="text-sm text-gray-400">{category.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sample Tasks */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-green-400" />
          Try These Reasoning Challenges
        </h3>
        <div className="space-y-2">
          {sampleTasks.map((sample, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => {
                setTask(sample);
                solveTask(sample);
              }}
              className="w-full text-left h-auto p-3 bg-white/5 text-white border-white/20 hover:bg-white/10 justify-start"
              disabled={isLoading}
            >
              <div className="text-sm">{sample}</div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Task Input */}
      <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Enter Reasoning Task</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your reasoning challenge here... (e.g., logic puzzles, paradoxes, complex word problems)"
              className="w-full h-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
          <Button
            onClick={() => solveTask(task)}
            disabled={!task.trim() || isLoading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            {isLoading ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Reasoning...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Solve Challenge
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
            Reasoning Analysis
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
