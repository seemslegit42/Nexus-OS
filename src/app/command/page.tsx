import { Zone } from '@/components/core/zone';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TerminalSquare, BookOpen, Send, Zap } from 'lucide-react';
import Image from 'next/image';

export default function CommandCauldronPage() {
  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Zone title="Unified Console" icon={<TerminalSquare className="w-5 h-5" />} className="lg:col-span-2 flex flex-col">
        <div className="flex-grow p-2 bg-background rounded-md border border-input mb-2 min-h-[200px]">
          <ScrollArea className="h-full">
            <pre className="text-xs text-muted-foreground p-2">
              {`NexOS Kernel v1.0.0
Last login: ${new Date().toLocaleString()}
[user@nexos ~]$ list active agents
> Agent OptimizerPrime: Active, 2 tasks
> Agent DataMinerX: Idle, 0 tasks
[user@nexos ~]$ `}
            </pre>
          </ScrollArea>
        </div>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="Enter natural language command, structured prompt, or script..." 
            className="flex-grow bg-background border-border focus:ring-primary" 
          />
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="mr-2 h-4 w-4" /> Execute
          </Button>
        </div>
      </Zone>

      <Zone title="Spellbook (Reusable Prompts & Scripts)" icon={<BookOpen className="w-5 h-5" />}>
        <ScrollArea className="h-64">
          <ul className="space-y-2">
            {['Analyze sales data Q3', 'Optimize frontend performance', 'Draft blog post on AI ethics', 'Security scan all services'].map((spell, i) => (
              <li key={i} className="p-3 bg-muted/50 rounded-md hover:bg-accent/30 cursor-pointer">
                <p className="text-sm font-medium text-foreground">{spell}</p>
                <p className="text-xs text-muted-foreground">Type: {i % 2 === 0 ? 'Prompt Chain' : 'Script'}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <Button variant="outline" className="w-full mt-4">Add New Spell</Button>
      </Zone>
      
      <Zone title="Execution Chain Visualizer" icon={<Zap className="w-5 h-5" />} className="lg:col-span-3">
        <div className="h-64 bg-muted/30 rounded-md flex items-center justify-center p-4">
          <Image src="https://placehold.co/800x300.png" alt="Execution Chain" width={800} height={300} className="rounded-md" data-ai-hint="flow chart diagram"/>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Visual feedback on what was triggered and the execution path of the last command.</p>
      </Zone>
    </div>
  );
}
