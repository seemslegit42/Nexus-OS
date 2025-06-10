import { Zone } from '@/components/core/zone';
import { PromptSandbox } from '@/components/loom-studio/prompt-sandbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, Rows, Edit3, ListChecks, PlayCircle, Aperture } from 'lucide-react';
import Image from 'next/image';

export default function LoomStudioPage() {
  return (
    <div className="flex-grow flex flex-col gap-4 font-code h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        {/* Left Column: Canvas & Prompt Layer */}
        <div className="md:col-span-2 flex flex-col gap-4 h-full">
          <Zone title="Canvas" icon={<Aperture className="w-5 h-5" />} className="flex-grow min-h-[300px] md:min-h-0">
            <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
              <Image src="https://placehold.co/800x500.png" alt="Canvas Area" width={800} height={500} className="object-contain max-h-full max-w-full rounded" data-ai-hint="visual programming canvas" />
            </div>
          </Zone>
          <Zone title="Prompt Layer / Editor" icon={<Edit3 className="w-5 h-5" />} className="min-h-[200px]">
            <Textarea placeholder="Enter your prompt or script here..." className="h-full font-code text-sm bg-background border-border focus:ring-primary resize-none" />
             <div className="mt-2 flex justify-end">
                <Button size="sm"><PlayCircle className="mr-2 h-4 w-4" /> Run Prompt</Button>
            </div>
          </Zone>
        </div>

        {/* Right Column: Inspector, Timeline, Prompt Sandbox */}
        <div className="flex flex-col gap-4 h-full">
          <Zone title="Inspector" icon={<ListChecks className="w-5 h-5" />} className="min-h-[200px]">
            <ScrollArea className="h-full">
              <div className="text-sm space-y-2 p-1">
                <p className="font-medium">Selected Node: <span className="text-primary">Agent_Start_01</span></p>
                <p>Type: <span className="text-muted-foreground">Trigger</span></p>
                <p>Status: <span className="text-green-500">Active</span></p>
                <p>Connections: <span className="text-muted-foreground">3</span></p>
                <Button variant="outline" size="sm" className="w-full mt-2">Edit Properties</Button>
              </div>
            </ScrollArea>
          </Zone>
          <Zone title="Timeline / Recordings" icon={<Rows className="w-5 h-5" />} className="min-h-[200px]">
             <div className="flex items-center justify-center h-full bg-muted/30 rounded-md">
               <Image src="https://placehold.co/400x200.png" alt="Timeline visualization" width={400} height={200} className="object-contain rounded" data-ai-hint="event timeline graph" />
             </div>
          </Zone>
          <Zone title="AI Prompt Injection Sandbox" icon={<Layers className="w-5 h-5" />} className="min-h-[200px]">
            <PromptSandbox />
          </Zone>
        </div>
      </div>
    </div>
  );
}
