
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';

interface AIToolbarProps {
  content: string;
  onInsert: (text: string) => void;
}

const AIToolbar: React.FC<AIToolbarProps> = ({ content, onInsert }) => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Mock AI functions - in a real implementation, these would call an API
  const simulateAIResponse = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simulated delay
      setTimeout(() => {
        // Sample responses based on action type
        const responses: Record<string, string> = {
          summarize: "## Summary\n\nThis note covers key points about project planning, including timeline estimates, resource allocation, and stakeholder communication strategies.",
          continue: content + "\n\nBuilding on these ideas, we could implement a phased approach that allows for iterative testing and feedback. This would mitigate risks and provide opportunities for course correction if needed.",
          improve: content.replace(/good/g, "excellent").replace(/nice/g, "outstanding"),
          custom: `Based on your request to "${prompt}", here's a suggested addition:\n\n### ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}\n\nThis would be an AI-generated response to your specific request, tailored to the content of your note and the guidance you've provided.`,
        };
        
        resolve(responses[prompt] || responses.custom);
      }, 1500);
    });
  };

  const handleAIAction = async (action: string) => {
    if (!content && action !== 'custom') {
      toast.error('Please add some content to your note first');
      return;
    }
    
    setLoading(true);
    try {
      const result = await simulateAIResponse(action);
      onInsert(result);
      toast.success(`AI ${action} completed`);
    } catch (error) {
      toast.error('Error generating AI content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    try {
      const result = await simulateAIResponse('custom');
      onInsert(result);
      toast.success('AI generated content');
      setPrompt('');
    } catch (error) {
      toast.error('Error generating AI content');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b p-2 flex items-center flex-wrap gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAIAction('summarize')}
        disabled={loading || !content}
      >
        {loading ? "Processing..." : "✨ Summarize"}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAIAction('continue')}
        disabled={loading || !content}
      >
        {loading ? "Processing..." : "✨ Continue writing"}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAIAction('improve')}
        disabled={loading || !content}
      >
        {loading ? "Processing..." : "✨ Improve writing"}
      </Button>
      
      <Separator orientation="vertical" className="h-6" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading}>
            ✨ Custom AI...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Custom AI Prompt</h4>
            <p className="text-sm text-muted-foreground">
              Describe what you want the AI to do with your note.
            </p>
            <div className="space-y-2">
              <textarea
                className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="E.g., Convert this into a bullet list of action items"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button 
                onClick={handleCustomPrompt} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Generate"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="flex-1 text-right">
        <span className="text-xs text-muted-foreground">
          AI features are simulated in this demo
        </span>
      </div>
    </div>
  );
};

export default AIToolbar;
