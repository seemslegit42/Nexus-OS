
'use client';

import { useState, type FormEvent } from 'react';
import { generatePromptVariations, type GeneratePromptVariationsInput, type GeneratePromptVariationsOutput } from '@/ai/flows/generate-prompt-variations';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2 } from 'lucide-react';

export function PromptSandbox() {
  const [prompt, setPrompt] = useState<string>('');
  const [numVariations, setNumVariations] = useState<number>(3);
  const [variations, setVariations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setVariations([]);

    try {
      const input: GeneratePromptVariationsInput = { prompt, numVariations };
      const result: GeneratePromptVariationsOutput = await generatePromptVariations(input);
      setVariations(result.variations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error("Error generating prompt variations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col font-code">
      <div>
        <Label htmlFor="original-prompt" className="font-medium text-sm">Original Prompt</Label>
        <Textarea
          id="original-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate variations..."
          required
          className="mt-1 min-h-[80px] bg-background border-border focus:ring-primary text-sm"
        />
      </div>
      <div>
        <Label htmlFor="num-variations" className="font-medium text-sm">Number of Variations (1-5)</Label>
        <Input
          id="num-variations"
          type="number"
          value={numVariations}
          onChange={(e) => setNumVariations(parseInt(e.target.value, 10))}
          min="1"
          max="5"
          required
          className="mt-1 bg-background border-border focus:ring-primary text-sm"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
        <Wand2 className="mr-2 h-4 w-4" />
        {isLoading ? 'Generating...' : 'Generate Variations'}
      </Button>
      {error && <p className="text-sm text-destructive">Error: {error}</p>}
      {variations.length > 0 && (
        <div className="flex-grow flex flex-col min-h-0">
          <h3 className="text-md font-semibold mb-2 font-headline">Generated Variations:</h3>
          <ScrollArea className="flex-grow border border-border rounded-md bg-background">
            <ul className="space-y-2 p-3">
              {variations.map((variation, index) => (
                <li key={index} className="text-sm p-2 bg-muted/50 rounded-sm">
                  {variation}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </form>
  );
}
